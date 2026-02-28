import { Controller, Get } from '@nestjs/common';

@Controller('eras')
export class ErasController {
  @Get()
  async getEras() {
    return [
      { id: '1', nameRu: 'Древний мир', nameEn: 'Ancient World', jdnStart: 1000000, jdnEnd: 1800000, colorHex: '#E8A838' },
      { id: '2', nameRu: 'Средневековье', nameEn: 'Middle Ages', jdnStart: 1800000, jdnEnd: 2200000, colorHex: '#6B8CBA' },
      { id: '3', nameRu: 'Новое время', nameEn: 'Modern Era', jdnStart: 2200000, jdnEnd: 2400000, colorHex: '#68A85C' },
      { id: '4', nameRu: 'Новейшее время', nameEn: 'Contemporary', jdnStart: 2400000, jdnEnd: null, colorHex: '#A86868' },
    ];
  }
}
