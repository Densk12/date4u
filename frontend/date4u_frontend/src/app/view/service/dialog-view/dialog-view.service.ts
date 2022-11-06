import { Injectable } from '@angular/core';
import { Modal } from 'bootstrap';
import * as $ from 'jquery';

@Injectable({
  providedIn: 'root'
})
export class DialogViewService {

  constructor() { }

  public showModalAccountDeletion(deleteAccountCallback: (modal: Modal) => void): void {
    const $modalAccountDeletion = $('#modal-account-deletion');
    const modalAccountDeletion = new Modal($modalAccountDeletion.get(0) as Element);

    $modalAccountDeletion.find('button.submit').off('click').on({
      click: (): void => deleteAccountCallback(modalAccountDeletion)
    });

    modalAccountDeletion.show();
  }
  
}
