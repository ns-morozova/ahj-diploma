import getRandomQuote from "./quotes";
import Connection from './connection';
import { saveAs } from 'file-saver';
import { CLIENT_ID } from './clientid';

export default class SidePanel {
    constructor(element, organizer) {
        this.element = element;
        this.organizer = organizer;

        document.getElementById('upLoadNotes').addEventListener('click', this.onUploadNotes.bind(this.organizer));
        document.getElementById('downLoadNotes').addEventListener('click', this.onDownloadNotes.bind(this.organizer));
        document.getElementById('createNotes').addEventListener('click', this.onCreateOneHundredNotes.bind(this.organizer));
        document.getElementById('fileInputLoadData').addEventListener('change', this.handleFiles.bind(this.organizer));

    }

    handleFiles(event){

        for (const file of event.target.files) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const data = JSON.parse(e.target.result);
                Connection.query('POST', { method: 'dataLoading', CLIENT_ID }, data).then(() => {
                    location.reload();
                }).catch(err => {
                    console.log(err);
                });
            };
            reader.readAsText(file); // Выбираем метод в зависимости от типа файла — мы все же разнообразны
        }
    }        

    onDownloadNotes(event) {
        event.preventDefault();
        this.togleSidePanel();

        document.getElementById('fileInputLoadData').click();
    }

    onUploadNotes(event) {
        event.preventDefault();
        this.togleSidePanel();
        Connection.query('GET', { method: 'allTickets', clientId: CLIENT_ID }).then(answer => {

            const dataExport = JSON.stringify(answer.data,2);
            const blob = new Blob([dataExport], { type: 'application/json' });
            saveAs(blob, 'data.json');        

        }).catch(err => {
            console.log(err);
        });    



    }

    async onCreateOneHundredNotes(event) {
        event.preventDefault();
        this.togleSidePanel();

        for (let i = 0; i < 100; i++) {
            let quot = getRandomQuote();

            await this.addMessage(quot, 'Вы').then(data => {
                Connection.query('POST', { method: 'createTicket', clientId: CLIENT_ID }, data);
                this.drawMessage(data);
            });

        }




    }


}