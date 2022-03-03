import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { map } from 'rxjs';

@Injectable()
export class ClockifyService {
  constructor(private httpService: HttpService) {}

  getClients(
    archived?: boolean,
    name?: string,
    page?: number,
    pageSize?: number,
    sortColumn?: string,
    sortOrder?: 'ASCENDING' | 'DESCENDING',
  ) {
    const params = {
      archived,
      name,
      page,
      pageSize,
      sortColumn,
      sortOrder,
    };

    const queryString = Object.entries(params)
      .filter(([key, value]) => value !== undefined)
      .map(([key, value]) => `${key}=${value}`)
      .join('&');

    return this.httpService
      .get(
        `/workspaces/${process.env.CLOCKIFY_WORKSPACE_ID}/clients?${queryString}`,
      )
      .pipe(map((response) => response.data));
  }

  getClient(id: string) {
    return this.httpService
      .get(`/workspaces/${process.env.CLOCKIFY_WORKSPACE_ID}/clients/${id}`)
      .pipe(
        map((response) => {
          return response.data;
        }),
      );
  }

  createClient(name: string) {
    return this.httpService
      .post(`/workspaces/${process.env.CLOCKIFY_WORKSPACE_ID}/clients`, {
        name,
      })
      .pipe(map((response) => response.data));
  }

  updateClient(id: string, name: string, archived: boolean = false) {
    return this.httpService
      .put(`/workspaces/${process.env.CLOCKIFY_WORKSPACE_ID}/clients/${id}`, {
        name,
        archived,
      })
      .pipe(map((response) => response.data));
  }

  deleteClient(id: string) {
    return this.httpService
      .delete(`/workspaces/${process.env.CLOCKIFY_WORKSPACE_ID}/clients/${id}`)
      .pipe(map((response) => response.data));
  }

  getProjects(
    hydrated: boolean,
    archived: boolean,
    name: string,
    page: number,
    pageSize: number,
    billable: boolean,
    clients: Array<string>,
    containsClient: boolean,
    clientStatus: 'ACTIVE' | 'ARCHIVED',
    users: Array<string>,
    containsUser: boolean,
    userStatus: 'ACTIVE' | 'INACTIVE',
    isTemplate: boolean,
    sortColumn: 'NAME' | 'CLIENT_NAME' | 'DURATION',
    sortOrder: 'ASCENDING' | 'DESCENDING',
  ) {}
}
