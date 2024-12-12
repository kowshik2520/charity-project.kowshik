import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { MessageModule } from 'primeng/message';
import { MessagesModule } from 'primeng/messages';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    CardModule,
    MessageModule,
    MessagesModule,
  ],
  providers: [MessageService],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  loginForm: FormGroup;
  loading: boolean = false;

  constructor(private fb: FormBuilder, private messageService: MessageService, private router: Router) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please fill in all fields.' });
      return;
    }

    this.loading = true;

    // Simulate an API call
    setTimeout(() => {
      this.loading = false;
      const { username, password } = this.loginForm.value;

      // Replace this with real authentication logic
      if (username === 'admin' && password === 'admin') {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Login successful!' });
        this.router.navigate(['/home'])
      } else {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Invalid credentials.' });
      }
    }, 1000);
  }

}
