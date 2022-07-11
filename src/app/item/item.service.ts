import { Injectable } from '@angular/core'

import { Item } from './item'

@Injectable({
  providedIn: 'root',
})
export class ItemService {
  private items = new Array<Item>(
    { id: 1, title: 'Ter Stegen', text: 'Goalkeeper' },
    { id: 2, title: 'Piqué', text: 'Defender' },
    { id: 3, title: 'Piqué', text: 'Defender' },
    { id: 4, title: 'I. Rakitic', text: 'Midfielder' },
    { id: 5, title: 'Sergio', text: 'Midfielder' },
    { id: 6, title: 'Denis Suárez', text: 'Midfielder' },
    { id: 7, title: 'Arda', text: 'Midfielder' },
    { id: 8, title: 'A. Iniesta', text: 'Midfielder' },
    { id: 9, title: 'Suárez', text: 'Forward' },
    { id: 10, title: 'Messi', text: 'Forward' },
    { id: 11, title: 'Neymar', text: 'Forward' },
    { id: 12, title: 'Rafinha', text: 'Midfielder' },
    { id: 13, title: 'Cillessen', text: 'Goalkeeper' },
    { id: 14, title: 'Mascherano', text: 'Defender' },
    { id: 17, title: 'Paco Alcácer', text: 'Forward' },
    { id: 18, title: 'Jordi Alba', text: 'Defender' },
    { id: 19, title: 'Digne', text: 'Defender' },
    { id: 20, title: 'Sergi Roberto', text: 'Midfielder' },
    { id: 21, title: 'André Gomes', text: 'Midfielder' },
    { id: 22, title: 'Aleix Vidal', text: 'Midfielder' },
    { id: 23, title: 'Umtiti', text: 'Defender' },
    { id: 24, title: 'Mathieu', text: 'Defender' },
    { id: 25, title: 'Masip', text: 'Goalkeeper' }
  )

  getItems(): Array<Item> {
    return this.items
  }

  getItem(id: number): Item {
    return this.items.filter((item) => item.id === id)[0]
  }
}
