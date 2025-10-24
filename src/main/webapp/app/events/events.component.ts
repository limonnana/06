import { Component, OnInit } from '@angular/core';
import { NgFor } from '@angular/common';
import { HttpResponse } from '@angular/common/http';
import { NgZone, inject, signal } from '@angular/core';
import { ActivatedRoute, Data, ParamMap, Router, RouterModule } from '@angular/router';
import { Observable, Subscription, combineLatest, filter, tap } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { SortByDirective, SortDirective, SortService, type SortState, sortStateSignal } from 'app/shared/sort';
import { FormatMediumDatePipe } from 'app/shared/date';
import { FormsModule } from '@angular/forms';
import { DEFAULT_SORT_DATA, ITEM_DELETED_EVENT, SORT } from 'app/config/navigation.constants';
import { IEvent } from '../entities/event/event.model';
import { EntityArrayResponseType, EventService, EntityResponseType } from '../entities/event/service/event.service';
import { IInvestment } from 'app/entities/investment/investment.model';
import { InvestmentService } from 'app/entities/investment/service/investment.service';

@Component({
  selector: 'jhi-events',
  imports: [NgFor, FormatMediumDatePipe],
  templateUrl: './events.component.html',
  styleUrl: './events.component.scss',
})
export default class EventsComponent implements OnInit {
  protected readonly eventService = inject(EventService);
  protected readonly investmentService = inject(InvestmentService);

  events?: IEvent[] | null;
  investments?: IInvestment[] | null;
  saldo: number | null | undefined;

  ngOnInit(): void {
    this.getEvents();
    this.getInvestments();
  }

  getEvents(): void {
    this.eventService.query().subscribe({
      next: (response: EntityArrayResponseType) => {
        this.events = response.body; // Aquí tienes tu lista de eventos
        console.log('el evento' + this.events);
        this.getSaldo();
      },
      error: error => console.error(error),
    });
  }

  getInvestments(): void {
    this.investmentService.query().subscribe({
      next: (response: EntityArrayResponseType) => {
        this.investments = response.body; // Aquí tienes tu lista de eventos
        console.log('el evento' + this.investments);
      },
      error: error => console.error(error),
    });
  }

  getSaldo(): void {
    this.eventService.saldo().subscribe({
      next: response => {
        console.log('Saldo response:', response);
        this.saldo = response.body?.saldo;
        console.log('Saldo asignado:', this.saldo);
      },
      error: error => console.error('Error:', error),
    });
  }

  protected onSuccess(res: HttpResponse<any>): void {
    console.log('la respuesta:' + res.body);
    this.saldo = res.body.saldo;
    console.log(this.saldo);
  }
}
