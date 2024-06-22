const uuid = require('uuid');
import Connection from './connection';
import Message from './Message';

export default class Organizer {
    constructor(element) {
        this.element = element;
        this.messages = [];
        this.eventSource;
        this.clientId;
    }

    init() {

        // Создаем уникальный ID для этого клиента
        this.clientId = Math.random().toString(36).substring(2);
        document.cookie = `clientId=${this.clientId}; max-age=86400; path=/`;

        const messageForm = document.getElementById('message-form');
        const fileInput = document.getElementById('file-input');
        messageForm.addEventListener('submit', this.onSubmit.bind(this));
        fileInput.addEventListener("change", this.onChange.bind(this));
        
        Connection.query('GET', { method: 'allTickets', clientId: this.clientId }).then(answer => {
            answer.data.sort((a, b) => a.date - b.date);
            answer.data.forEach(mess => {
                this.drawMessage(mess);
            });
            this.eventSource = new EventSource(`http://127.0.0.1:7070/sse?clientId=${this.clientId}`);
            this.eventSource.addEventListener('open', this.onOpenEss.bind(this));
            this.eventSource.addEventListener('error', this.onErrorEss.bind(this));
            this.eventSource.addEventListener('message', this.onMessageEss.bind(this));

        }).catch(err => {
            console.log(err);
        });
    }

    drawMessage(objData) {
        const message = new Message(objData);
        const messageList = document.getElementById('message-list');
        messageList.appendChild(message.element);
        messageList.scrollTop = messageList.scrollHeight;
        this.messages.push(message);
    }

    async addMessage(message, sender, file) {

        return new Promise((resolve) => {
            const uid = uuid.v4();
            if (file) {
                let nameElement = '';
                if (file.type.startsWith('audio/')) {
                    nameElement = 'audio';
                } else if (file.type.startsWith('video/')) {
                    nameElement = 'video';
                } else {
                    console.error("Неизвестный тип файла: " + file.type);
                    return;
                }
                // Загружаем файл в элемент медиа
                const reader = new FileReader();
                reader.onload = function (e) {
                    resolve({ id: uid, sender, date: new Date().getTime(), message, media: { raw: e.target.result, tipeMedia: nameElement, fileName: file.name }});
                }
                reader.readAsDataURL(file);
            } else {
                resolve({ id: uid, sender, date: new Date().getTime(), message, media: { tipeMedia: 'none' } });
            }

        });
    }


    onOpenEss(event) {
        console.log(event);
    }

    onErrorEss(event) {
        console.log(event);
    }

    onMessageEss(event) {
        const newMess = JSON.parse(event.data);
        const mess = this.messages.find(item => item.id == newMess.id);

        if (!mess){
            this.drawMessage(newMess);
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
            Connection.query('POST', { method: 'createTicket', clientId: this.clientId }, data);
            this.drawMessage(data);
            messageInput.value = '';
            fileInput.value = '';
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
            Connection.query('POST', { method: 'createTicket', clientId: this.clientId }, data);
            this.drawMessage(data);
            const fileInput = document.getElementById('file-input');
            messageInput.value = '';
            fileInput.value = '';
        });
    }
}