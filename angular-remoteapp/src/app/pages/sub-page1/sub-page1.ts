import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-sub-page1',
  standalone: true,
  imports: [CommonModule, ButtonModule, CardModule, TagModule, TableModule],
  template: `
    <div style="padding: 1rem;">
      <h2 style="margin-bottom: 1.5rem; font-size: 1.5rem; font-weight: 700;">
        PrimeNG Components
      </h2>

      <div style="display: flex; gap: 1rem; flex-wrap: wrap; margin-bottom: 2rem;">
        <p-button label="Primary" severity="primary" />
        <p-button label="Success" severity="success" />
        <p-button label="Warning" severity="warn" />
        <p-button label="Danger" severity="danger" />
        <p-button label="Outlined" [outlined]="true" />
      </div>

      <div style="display: flex; gap: 1rem; flex-wrap: wrap; margin-bottom: 2rem;">
        <p-tag value="Angular" severity="info" />
        <p-tag value="PrimeNG" severity="success" />
        <p-tag value="Web Component" severity="warn" />
        <p-tag value="Micro Frontend" severity="danger" />
      </div>

      <div style="max-width: 480px;">
        <p-card header="PrimeNG Card" subheader="Embedded in Vue host via Angular Elements">
          <p>
            This card is a PrimeNG component running inside an Angular custom element, embedded in a
            Vue 3 host app via Web Components API.
          </p>
          <ng-template pTemplate="footer">
            <p-button label="Learn More" [outlined]="true" size="small" />
          </ng-template>
        </p-card>
      </div>

      <div style="margin-top: 2rem;">
        <p-table
          [value]="users"
          [tableStyle]="{ 'min-width': '40rem' }"
          styleClass="p-datatable-striped"
        >
          <ng-template pTemplate="header">
            <tr>
              <th>Name</th>
              <th>Role</th>
              <th>Status</th>
            </tr>
          </ng-template>
          <ng-template pTemplate="body" let-user>
            <tr>
              <td>{{ user.name }}</td>
              <td>{{ user.role }}</td>
              <td>
                <p-tag
                  [value]="user.status"
                  [severity]="user.status === 'Active' ? 'success' : 'warn'"
                />
              </td>
            </tr>
          </ng-template>
        </p-table>
      </div>
    </div>
  `,
})
export class SubPage1Component {
  users = [
    { name: 'Alice Johnson', role: 'Frontend Dev', status: 'Active' },
    { name: 'Bob Smith', role: 'Backend Dev', status: 'Inactive' },
    { name: 'Carol White', role: 'Designer', status: 'Active' },
    { name: 'Dan Brown', role: 'DevOps', status: 'Active' },
  ];
}
