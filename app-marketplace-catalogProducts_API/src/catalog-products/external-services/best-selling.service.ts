import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { BestSelling } from '../entities/best-selling.entity';

@Injectable()
export class BestSellingService {
  async getBestSellingProductsByMonth(): Promise<BestSelling[]> {
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];

    const now = new Date();
    const currentMonth = months[now.getMonth()];
    try {
      const response = await axios.get(
        `${process.env.BESTSELLING_API}best-selling-products`,
        {
          params: {
            month: currentMonth.toUpperCase(),
          },
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      return response.data;
    } catch (error) {
      throw new Error('Erro ao obter os produtos mais vendidos.');
    }
  }
}
