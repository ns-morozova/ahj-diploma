export default class Modal {
    constructor(id) {
        this.id = id;
        this.modalOverlay = document.getElementById('modalOverlay');

    }

    async showModal() {

        this.modalOverlay.style.display = 'flex';
        document.body.style.overflow = 'hidden'; // Блокировка прокрутки страницы

        return new Promise(resolve => {
            document.getElementById('closeModalButton').addEventListener('click', () => {
                this.closeModal();
                resolve(null);
            },true);
            document.getElementById('cancelButton').addEventListener('click', () => {
                this.closeModal();
                resolve(null);
            }, true);
            document.getElementById('confirmButton').addEventListener('click', () => {
                this.closeModal();
                resolve(this.id);
            }, true);
            
        });

    }

    closeModal(){
        this.modalOverlay.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

}