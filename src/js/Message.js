import { convertLinks } from '../utils';
import { saveAs } from 'file-saver';
import { base64ToBlob } from '../utils';

export default class Message {
    constructor(data) {
        this.data = data;
        const element = document.createElement('div');
        element.id = data.id;
        element.classList.add('message');
        element.classList.add(data.sender === 'Вы' ? 'my-message' : 'bot-message');
        element.innerHTML = `<strong>${data.sender}:</strong> ${convertLinks(data.message)}`;
        if (!(data.media.tipeMedia == 'none')) {
            const media = document.createElement(data.media.tipeMedia);
            media.classList.add('video-element');
            element.title = data.media.fileName;
            media.src = data.media.raw;
            media.controls = true;
            element.appendChild(media);

            const diskette = document.createElement('div');
            diskette.classList.add('diskette-icon');
            diskette.innerHTML = '<i class="fas fa-save"></i>';
            element.appendChild(diskette);
            diskette.addEventListener('click', this.onClickSave.bind(this));
        }
        this.element = element;
    }

    onClickSave(event) {
        event.preventDefault();
        const base64Data = this.element.querySelector('.video-element').src;
        const blob = base64ToBlob(base64Data, this.data.tipeMedia);
        saveAs(blob, this.element.title);        
    }
}