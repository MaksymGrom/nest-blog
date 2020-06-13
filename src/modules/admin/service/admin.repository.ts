import { Injectable } from '@nestjs/common';
import { Admin } from '../model/admin';

@Injectable()
export class AdminRepository {
  private readonly admins: Admin[];
  constructor() {
    this.admins = [
      {
        id: 1,
        login: 'grommax',
        password: 'secret'
      }
    ];
  }

  async findByLogin(login: string): Promise<Admin | undefined> {
    return this.admins.find(admin => admin.login === login);
  }
}
