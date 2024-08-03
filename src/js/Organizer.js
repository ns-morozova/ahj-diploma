const uuid = require('uuid');
import Connection from './connection';
import Message from './Message';
import SidePanel from './SidePanel';
import { CLIENT_ID } from './clientid';
import Modal from './modal';
import PinedMessage from './PinnedMessage';
//import InterseIntersectionObserver from '@atayahmet/observer-js';

export default class Organizer {
    constructor(element) {
        this.element = element;
        this.messages = [];
        this.eventSource;
        this.sidePanel;
        this.observer;
        this.shift = 1;
        this.count = 10;
        this.divider = document.createElement('div');
        this.divider.id = 'divider';
        this.messageList = document.getElementById('message-list');
        this.chunks = [];
        this.modalRecord = document.getElementById('modal-record');
        this.mediaRecorder;
        this.editingMessage;
        this.pined;
        this.modal;
        this.message;
    }

    init() {

        document.body.classList.add('loading');

        document.cookie = `clientId=${CLIENT_ID}; max-age=86400; path=/`;

        const messageForm = document.getElementById('message-form');
        const fileInput = document.getElementById('file-input');
        this.messageList.append(this.divider);
        messageForm.addEventListener('submit', this.onSubmit.bind(this));
        fileInput.addEventListener("change", this.onChange.bind(this));

        document.getElementById('inputMicrophone').addEventListener("click", this.onClickInputMicrophone.bind(this));
        document.getElementById('inputVideo').addEventListener("click", this.onClickInputVideo.bind(this));

        document.addEventListener('dragover', (event) => {
            event.preventDefault();
            event.dataTransfer.dropEffect = 'none'; // Отключение перетаскивания по умолчанию
        });

        Connection.query('GET', { method: 'allTicketsPart', clientId: CLIENT_ID, count: this.count, shift: this.shift }).then(answer => {
            answer.data.data.sort((a, b) => b.date - a.date);
            answer.data.data.forEach(mess => {
                this.drawMessage(mess, false);
            });
            this.eventSource = new EventSource(`${Connection.URL}/sse?clientId=${CLIENT_ID}`);
            this.eventSource.addEventListener('open', this.onOpenEss.bind(this));
            this.eventSource.addEventListener('error', this.onErrorEss.bind(this));
            this.eventSource.addEventListener('message', this.onMessageEss.bind(this));

            document.getElementById('stopRecording').addEventListener('click', this.stopRecording.bind(this));

            document.body.classList.remove('loading');

            this.observer = new IntersectionObserver(this.onInspectionObserver.bind(this), {
                root: document.getElementById('message-list'),
                rootMargin: "0px",
                threshold: 1.0,
            });

            this.observer.observe(this.divider);

            this.messageList.addEventListener('dragover', this.onDragover.bind(this));
            this.messageList.addEventListener('dragenter', this.onDragenter.bind(this));
            this.messageList.addEventListener('dragleave', this.onDragleave.bind(this));
            this.messageList.addEventListener('drop', this.onDrop.bind(this));

        }).catch(err => {
            console.log(err);
        });
        document.getElementById('first-menu').addEventListener('click', this.onClickFirstMenu.bind(this));
        document.addEventListener('click', this.onClickOutside.bind(this)); // Добавить обработчик клика по документу
        this.sidePanel = new SidePanel(document.getElementById('sidePanel'), this);


        document.addEventListener('click', (event) => {
            if (!event.target.closest('#contextMenu')) {
                const contextMenu = document.getElementById('contextMenu');
                contextMenu.style.display = 'none';
            }
        });

        const contextMenu = document.getElementById('contextMenu');
        contextMenu.addEventListener('click', this.onClickContextMenu.bind(this));


        //окно редактирования
        document.getElementById('closeEditButton').addEventListener('click', event => {
            event.preventDefault();
            this.closeEditMessage();
        });
        document.getElementById('editMessageContainer').addEventListener('submit', this.onSubmitFromEdit.bind(this));

    }

    onSubmitFromEdit(event) {
        event.preventDefault();
        const message = this.messages.find(elem => elem.data.id === event.currentTarget.dataset.id);
        const editMessageInput = document.getElementById('editMessageInput');
        message.updateMessage(editMessageInput.value).then(() => {
            this.closeEditMessage();
        }).catch(err => {
            console.log(err);
        });
    }

    onClickContextMenu(event) {
        if (event.target.closest('.context-menu-item')) {
            const contextMenu = document.getElementById('contextMenu');
            const action = event.target.closest('.context-menu-item').getAttribute('data-action');
            this.handleContextMenuAction(action, contextMenu.getAttribute('data-id'));
            contextMenu.style.display = 'none';
        }
    }

    closeEditMessage() {
        const editMessageContainer = document.getElementById('editMessageContainer');
        editMessageContainer.style.display = 'none';
        const form = document.getElementById('message-form');
        form.style.display = 'flex';
    }

    handleContextMenuAction(action, messageId) {
        const message = this.messages.find(msg => msg.data.id === messageId);
        switch (action) {
            case 'edit':
                if (message) {
                    const oldMessageText = document.getElementById('oldMessageText');
                    const editMessageInput = document.getElementById('editMessageInput');
                    const editMessageContainer = document.getElementById('editMessageContainer');
                    editMessageContainer.setAttribute('data-id', messageId);
                    const form = document.getElementById('message-form');
                    form.style.display = 'none';

                    this.editingMessage = message;
                    oldMessageText.textContent = message.data.message;
                    editMessageInput.value = message.data.message;
                    editMessageContainer.style.display = 'block';
                }

                break;
            case 'pin':
                if (message) {                  
                    Connection.query('PUT', { method: 'ticketPinned', clientId: CLIENT_ID, id: messageId }).then(() => {
                        this.pined = new PinedMessage(message.data);
                    });
                }

                break;
            case 'favorite':
                alert(`Добавить в избранное сообщение с ID: ${messageId}`);
                break;
            case 'delete':
                this.modal = new Modal(messageId);
                this.modal.showModal().then((answer) => {
                    if (!answer) return;

                    Connection.query('DELETE', { method: 'deleteById', clientId: CLIENT_ID, id: answer }).then(() => {
                    this.modal = null;
                    });

                }).catch(err => {
                    console.error(err);
                });
                break;
            default:
                break;
        }
    }


    onDragenter(event) {
        event.preventDefault();
        this.messageList.style.cursor = 'grabbing';
        console.log('onDragenter');
        //return false;
    }

    onDragover(event) {
        event.stopPropagation();
        event.preventDefault();
        event.dataTransfer.dropEffect = 'copy'; // Установка эффекта копирования
        this.messageList.style.cursor = 'copy';
        console.log('onDragover');
        //return false;
    }

    onDragleave(event) {
        event.preventDefault();
        this.messageList.style.cursor = 'default';
        console.log('onDragleave');

    }

    onDrop(event) {
        event.preventDefault();
        this.messageList.style.cursor = 'default';

        const files = event.dataTransfer.files;
        for (const file of files) {
            if (file.type.startsWith('video/') || file.type.startsWith('audio/')) {
                this.addMessage('', 'Вы', file).then(data => {
                    Connection.query('POST', { method: 'createTicket', clientId: CLIENT_ID }, data);
                    this.drawMessage(data);
                });





            } else {
                alert('Только видео и аудио файлы поддерживаются!');
            }
        }
    }

    onInspectionObserver(entries) {
        entries.forEach((entry) => {
            // если целевой элемент находится в зоне видимости
            if (entry.isIntersecting) {
                this.shift++;
                Connection.query('GET', { method: 'allTicketsPart', clientId: CLIENT_ID, count: this.count, shift: this.shift }).then(answer => {

                    const totalCount = answer.data.totalCount;
                    if (totalCount == this.messages.length) {
                        return;
                    }

                    answer.data.data.sort((a, b) => b.date - a.date);
                    answer.data.data.forEach(mess => {
                        // Сохраняем текущую позицию прокрутки
                        const currentScrollPosition = this.messageList.scrollTop;
                        // Сохраняем высоту контейнера до добавления новых элементов
                        const previousHeight = this.messageList.scrollHeight;

                        this.drawMessage(mess, false);

                        // Сохраняем высоту контейнера после добавления новых элементов
                        const newHeight = this.messageList.scrollHeight;
                        // Восстанавливаем позицию прокрутки
                        this.messageList.scrollTop = currentScrollPosition + (newHeight - previousHeight);
                    });
                }).catch(err => {
                    console.log(err);
                });
            }
        });
    }

    drawMessage(objData, toEnd = true) {
        const message = new Message(objData);
        if (toEnd) this.messageList.append(message.element)
        else {
            this.divider.after(message.element)
        }

        this.messageList.scrollTop = this.messageList.scrollHeight;
        this.messages.push(message);
    }

    async addMessage(message, sender, file) {

        return new Promise((resolve) => {
            const uid = uuid.v4();
            if (file) {
                let nameElement = '';
                if (file.type.startsWith('audio')) {
                    nameElement = file.type;
                } else if (file.type.startsWith('video')) {
                    nameElement = file.type;
                } else {
                    console.error("Неизвестный тип файла: " + file.type);
                    return;
                }
                // Загружаем файл в элемент медиа
                const reader = new FileReader();
                reader.onload = function (e) {
                    resolve({ id: uid, sender, date: new Date().getTime(), message, media: { raw: e.target.result, tipeMedia: nameElement, fileName: file.name } });
                }
                reader.readAsDataURL(file);
            } else {
                resolve({ id: uid, sender, date: new Date().getTime(), message, media: { tipeMedia: 'none' } });
            }

        });
    }

    togleSidePanel() {
        this.sidePanel.element.classList.toggle('open');
    }

    onClickDocument(event) {
        event.preventDefault();

        const isClickInside = document.getElementById('first-menu').contains(event.target);

        if (isClickInside) {
            this.sidePanel.element.classList.toggle('open');
        }
    }


    onClickFirstMenu(event) {
        event.preventDefault();
        this.togleSidePanel();
        event.stopPropagation();
    }

    onClickOutside(event) {
        const sidePanel = document.getElementById('sidePanel');
        const firstMenu = document.getElementById('first-menu');
        if (!sidePanel.contains(event.target) && !firstMenu.contains(event.target) && sidePanel.classList.contains('open')) {
            this.sidePanel.element.classList.remove('open');
        }
    }

    onOpenEss(event) {
        console.log(event);
    }

    onErrorEss(event) {
        console.log(event);
    }

    onMessageEss(event) {

        const data = JSON.parse(event.data);  
        const action = data.action;

        let mess = null;
        switch (action) {
            case 'add':
                mess = this.messages.find(item => item.data.id == data.ticket.id);
                if (!mess) {
                    this.drawMessage(data.ticket);
                    return;
                }
                //обновим текстовое сообщение
                mess.data.message = data.ticket.message;
                mess.updTextMessage();
                break;
            case 'reloaddata':
                location.reload();
                break;
            case 'update':
                mess = this.messages.find(item => item.data.id == data.ticket.id);
                if (!mess) {
                    this.drawMessage(data.ticket);
                    return;
                }
                //обновим текстовое сообщение
                mess.data.message = data.ticket.message;
                mess.updTextMessage();
                break;
            case 'pinned':
                this.pined = new PinedMessage(data.ticket);
                break;
            case 'unpinned':
                if (this.pined) {
                    this.pined.hidePinned();
                    this.pined = null;
                }               
                break;
            case 'delete':
                this.message = document.getElementById(data.id);
                if (this.message) {
                    this.message.remove();
                    mess = this.messages.find(item => item.data.id == data.id);
                    this.messages.splice(this.messages.indexOf(mess), 1);
                    return;
                }
                break;
            default:
                break;
        }


    }

    onSubmit(event) {
        event.preventDefault();
        const messageInput = document.getElementById('message-input');
        const message = messageInput.value;
        if (message == '') return;
        const fileInput = document.getElementById('file-input');
        const file = fileInput.files[0];
        this.addMessage(message, 'Вы', file).then(data => {
            Connection.query('POST', { method: 'createTicket', clientId: CLIENT_ID }, data);
            this.drawMessage(data);
            messageInput.value = '';
            fileInput.value = '';
        });

    }

    showModalRecord() {
        this.modalRecord.style.display = 'flex';
    }

    hideModalRecord() {
        this.modalRecord.style.display = 'none';
    }

    stopRecording() {
        if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
            this.mediaRecorder.stop();
        }
    }

    blobToFile(blob, fileName) {
        const file = new File([blob], fileName, { type: blob.type });
        return file;
    }

    onClickInputMicrophone() {
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(stream => {

                this.mediaRecorder = new MediaRecorder(stream);
                this.mediaRecorder.start();

                this.showModalRecord();

                this.mediaRecorder.ondataavailable = event => {
                    this.chunks.push(event.data);
                };

                const stopRec = () => {
                    const blob = new Blob(this.chunks, { 'type': 'audio/ogg; codecs=opus' });
                    this.chunks = [];
                    this.hideModalRecord();

                    const messageInput = document.getElementById('message-input');
                    const file = this.blobToFile(blob, 'audiostream.opus');
                    this.addMessage(messageInput.value, 'Вы', file).then(data => {
                        Connection.query('POST', { method: 'createTicket', clientId: CLIENT_ID }, data);
                        this.drawMessage(data);
                        messageInput.value = '';
                    });

                }

                this.mediaRecorder.addEventListener('stop', stopRec.bind(this));

                const stopMedia = () => {
                    this.mediaRecorder.stop();
                };
                setTimeout(stopMedia.bind(this), 20000); // Запись 20 секунд
            })
            .catch(error => {
                console.error('Ошибка доступа к микрофону:', error);
            });

    }

    onClickInputVideo() {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then(stream => {

                this.mediaRecorder = new MediaRecorder(stream);
                this.mediaRecorder.start();

                this.showModalRecord();

                this.mediaRecorder.ondataavailable = event => {
                    this.chunks.push(event.data);
                };

                const stopRec = () => {
                    const blob = new Blob(this.chunks, { 'type': 'video/webm' });
                    this.chunks = [];
                    this.hideModalRecord();

                    const messageInput = document.getElementById('message-input');
                    const file = this.blobToFile(blob, 'audiostream.webm');
                    this.addMessage(messageInput.value, 'Вы', file).then(data => {
                        Connection.query('POST', { method: 'createTicket', clientId: CLIENT_ID }, data);
                        this.drawMessage(data);
                        messageInput.value = '';
                    });

                }

                this.mediaRecorder.addEventListener('stop', stopRec.bind(this));

                const stopMedia = () => {
                    this.mediaRecorder.stop();
                };
                setTimeout(stopMedia.bind(this), 20000); // Запись 20 секунд
            })
            .catch(error => {
                console.error('Ошибка доступа к камере с микрофоном:', error);
            });
    }



    onChange(event) {
        const messageInput = document.getElementById('message-input');
        let message = messageInput.value;
        if (message == '') {
            message = '<без комментария>';
        }

        let file = event.target.files[0];
        this.addMessage(message, 'Вы', file).then(data => {
            Connection.query('POST', { method: 'createTicket', clientId: CLIENT_ID }, data);
            this.drawMessage(data);
            const fileInput = document.getElementById('file-input');
            messageInput.value = '';
            fileInput.value = '';
        });
    }
}