import { AdminRepository } from '../../admin/service/admin.repository';
import { Admin } from '../../admin/model/admin';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(private adminRepository: AdminRepository) {
  }

  async validateAdmin(login: string, pass: string): Promise<Admin | null> {
    const admin: Admin = await this.adminRepository.findByLogin(login);

    if (admin && admin.password === pass) {
      const {password, ...secureAdmin} = admin;
      return secureAdmin;
    }

    return null;
  }
}
