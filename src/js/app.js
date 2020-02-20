import initData from './InitData.js';
import WorkDisplay from './WorkDisplay.js';
import Popovers from './Popovers.js';
import ConfirmDel from './ConfirmDel.js';
import XHR from './XHR.js';

const workDisplay = new WorkDisplay();
const popup = new Popovers(document.body);
const confirmDel = new ConfirmDel();
const xhrClass = new XHR();

class Work {
  constructor() {
    this.tableGoods = document.querySelector('#list-ticket');
    this.elAddProduct = document.querySelector('#add-ticket');
    this.id = null;
    this.itemIndex = null;
  }

  async init() {
    initData();
    const arrTickets = await xhrClass.getTickets();
    workDisplay.redrawGoods(arrTickets);

    popup.bindToDOM();
    popup.saveProduct(this.saveProduct.bind(this));
    this.inputName = document.querySelector('#name');
    this.inputDescription = document.querySelector('#description');
    this.popupTitle = document.querySelector('#title-popup');
    confirmDel.init();
    this.eventsGoods();
  }

  eventsGoods() {
    this.tableGoods.addEventListener('click', async (event) => {
      const eClass = event.target.classList;
      this.id = event.target.closest('.item-ticket').dataset.id;
      // change status
      if (eClass.contains('change-status')) {
        const itemStatus = event.target.dataset.status;
        const sendStatus = itemStatus === 'true' ? 'false' : 'true';
        await xhrClass.changeStatus(this.id, sendStatus);
        const arrTickets = await xhrClass.getTickets();
        workDisplay.redrawGoods(arrTickets);
      }

      // change add-ticket
      if (eClass.contains('change-ticket')) {
        const itemName = event.target.closest('.item-ticket').querySelector('.td-name').innerText;
        const description = await xhrClass.getDescription(this.id);
        this.inputName.value = itemName;
        this.inputDescription.value = description;
        this.popupTitle.innerText = 'Изменить тикет';
        popup.showPopup();
      }
      // delete product
      if (eClass.contains('del-ticket')) {
        confirmDel.delElement(this.delProduct.bind(this));
      }
      // get description
      if (eClass.contains('td-name')) {
        const itemDescription = event.target.parentNode.querySelector('.description');
        if (!itemDescription) {
          const description = await xhrClass.getDescription(this.id);
          const elDescription = document.createElement('div');
          elDescription.className = 'description';
          elDescription.innerHTML = `
          <p>${description}</p>
          `;
          event.target.parentNode.appendChild(elDescription);
        } else {
          itemDescription.classList.toggle('hidden');
        }
      }
    });

    this.elAddProduct.addEventListener('click', () => {
      this.id = null;
      this.popupTitle.innerText = 'Добавить тикет';
      popup.showPopup();
    });
  }

  async delProduct() {
    await xhrClass.delTicket(this.id);
    const arrTickets = await xhrClass.getTickets();
    workDisplay.redrawGoods(arrTickets);
  }

  async saveProduct() {
    if (this.id !== null) {
      // change
      await xhrClass.changeTickets(this.id, this.inputName.value, this.inputDescription.value);
    } else {
      // save new
      await xhrClass.addTicket(this.inputName.value, this.inputDescription.value);
    }
    const arrTickets = await xhrClass.getTickets();
    workDisplay.redrawGoods(arrTickets);
  }
}

const work = new Work();
work.init();
