import Connection from "./connection";
import { CLIENT_ID } from "./clientid";

export default class PinedMessage {
    constructor(data) {
        this.data = data;
        this.element = document.getElementById('pinnedMessage');
        this.element.innerHTML =
            `<i class="fas fa-thumbtack"></i>
            <span>
                <i>${this.data.message}</i>
            </span>`;
        this.element.style.display = 'block';
        this.element.querySelector('.fas').addEventListener('click', this.onCklickUnPined.bind(this),true);
    }

    hidePinned() {
        this.element.style.display = 'none';
    }

    onCklickUnPined(event) {
        event.preventDefault();
        Connection.query('DELETE', { method: 'ticketUnPinned', clientId: CLIENT_ID, id: this.data.id }).then(() => {
            this.hidePinned();            
        });
    }

}