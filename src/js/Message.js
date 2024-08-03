import { saveAs } from 'file-saver';
import Utils from '../utils';
import Connection from './connection';
import { CLIENT_ID } from './clientid';


export default class Message {

    constructor(data) {
        this.data = data;
        const element = document.createElement('div');
        element.classList.add('message-cont');
        element.id = data.id;

        const messageElement = document.createElement('div');
        messageElement.classList.add('message');
        messageElement.classList.add(data.sender === 'Вы' ? 'my-message' : 'bot-message');
        messageElement.innerHTML = `
            <div class="message-content">${Utils.convertLinks(data.message)}</div>`;
        if (!(data.media.tipeMedia == 'none')) {
            let nameMedia = '';
            if (data.media.tipeMedia.startsWith('audio')) {
                nameMedia = 'audio';
            }
            if (data.media.tipeMedia.startsWith('video')) {
                nameMedia = 'video';
            }
            const media = document.createElement(nameMedia);
            media.classList.add('video-element');
            messageElement.title = data.media.fileName;
            media.src = data.media.raw;
            media.controls = true;
            messageElement.querySelector('.message-content').appendChild(media);

            const diskette = document.createElement('div');
            diskette.classList.add('diskette-icon');
            diskette.innerHTML = '<button class="btn-save"><i class="fas fa-save"></i></button>';
            messageElement.querySelector('.message-content').appendChild(diskette);
            const btnSave = messageElement.querySelector('.btn-save');
            btnSave.addEventListener('click', this.onClickSave.bind(this));
        }

        const senderElement = document.createElement('div');
        senderElement.classList.add('message-sender');
        senderElement.classList.add(data.sender === 'Вы' ? 'my-sender' : 'bot-sender');
        senderElement.innerHTML = `
            <span>${data.sender === 'Вы' ? 'you' : 'bot'}</span>
            <span class="message-time">${new Date(data.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        `;

        element.appendChild(messageElement);
        element.appendChild(senderElement);

        this.element = element;

        element.addEventListener('contextmenu',this.onClickMessage.bind(this));       
    }

    onClickMessage(event) {
        event.preventDefault();

        const contextMenu = document.getElementById('contextMenu');
        
        const currentMessageId = event.currentTarget.getAttribute('id');
        contextMenu.setAttribute('data-id', currentMessageId);

        contextMenu.style.top = `${event.pageY}px`;
        contextMenu.style.left = `${event.pageX}px`;
        contextMenu.style.display = 'block';

    }
    

    onClickSave(event) {
        event.preventDefault();
        Utils.base64ToBlobF(this.element.querySelector('.video-element').src, this.data.media.tipeMedia).then((blob) => {
            const mess = document.getElementById(this.data.id);
            saveAs(blob, mess.title);
        });

    }

    updTextMessage(){
        const cont = this.element.querySelector('.message-content');
        
        // Сохраняем все медиа элементы
        const mediaElements = Array.from(cont.querySelectorAll('img, video, audio, iframe'));

        // Удаляем все дочерние элементы
        while (cont.firstChild) {
            cont.removeChild(cont.firstChild);
        }
        // Добавляем новый текст
        cont.innerHTML = Utils.convertLinks(this.data.message);
        // Восстанавливаем все медиа элементы
        mediaElements.forEach(mediaElement => cont.appendChild(mediaElement));        
    }

    async updateMessage(newMessage) {
        const data = this.data;
        data.message = newMessage;
        try {
            await Connection.query('POST', { method: 'updateById', clientId: CLIENT_ID }, data);
            this.data = data;
            this.updTextMessage();
        } catch(err) {
            throw new Error(err);
        }
        
        
    }


}