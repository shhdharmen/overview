import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Injector, Input, NgModule, TemplateRef } from '@angular/core';
import { Content } from '../views/types';

enum ContentType {
  String,
  Template,
  Component,
}

@Component({
  selector: 'dynamic-content',
  template: `
    <ng-container [ngSwitch]="contentType">
      <div *ngSwitchCase="ContentType.String" [innerHTML]="content"></div>

      <ng-container *ngSwitchCase="ContentType.Template">
        <ng-container *ngTemplateOutlet="content; context: context"></ng-container>
      </ng-container>

      <ng-container *ngSwitchCase="ContentType.Component">
        <ng-container *ngComponentOutlet="content; injector: injector"></ng-container>
      </ng-container>
    </ng-container>
  `,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DynamicContentComponent {
  ContentType = ContentType;

  @Input()
  set content(contentType: Content) {
    this._content = contentType;
    this.resolveContentType();
  }

  @Input() context: any;
  @Input() injector: Injector;

  get content(): Content {
    return this._content;
  }

  contentType = ContentType.String;

  private _content: Content;

  private resolveContentType() {
    if (typeof this.content === 'string') {
      this.contentType = ContentType.String;
    } else if (this.content instanceof TemplateRef) {
      this.contentType = ContentType.Template;
    } else {
      this.contentType = ContentType.Component;
    }
  }
}

@NgModule({
  imports: [CommonModule],
  declarations: [DynamicContentComponent],
  exports: [DynamicContentComponent],
})
export class DynamicContentModule {}
