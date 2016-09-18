import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DROPDOWN_DIRECTIVES } from "./dropdown/index";
import { DynamicBlock } from "./dynamic-block/dynamic-block.component";
import { EmailInputComponent } from "./email/email-input.component";
import { FooterComponent } from "../layout/footer/footer.component";
import { TableComponent } from "./grid/table.component";
import { PageTableComponent } from "./grid/page-table.component";
import { PasswordInputComponent } from "./password/password-input.component";
import { QRCodeComponent } from "./qrcode/qrcode.component";
import { LoadingOverlayComponent } from "./grid/loading-overlay.component";
import { PageSizeComponent } from "./grid/page-size.component";
import { PaginationComponent } from "./grid/pagination.component";
import { InlineEditComponent } from "./grid/inline-edit.component";
import { InlineSelectComponent } from "./grid/inline-select.component";
import { RowActionsComponent } from "./grid/row-actions.component";
import { RouterModule } from "@angular/router";
import { OauthButtonsComponent } from "./oauth-buttons/oauth-buttons.component";
import { CoreModalModule } from "./modal/module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    CoreModalModule
  ],
  declarations: [
    ...DROPDOWN_DIRECTIVES,
    DynamicBlock,
    EmailInputComponent,
    TableComponent,
    PageTableComponent,
    PasswordInputComponent,
    QRCodeComponent,

    PaginationComponent,
    PageSizeComponent,
    LoadingOverlayComponent,
    InlineEditComponent,
    InlineSelectComponent,
    RowActionsComponent,

    OauthButtonsComponent
  ],

  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CoreModalModule,

    DynamicBlock,
    EmailInputComponent,
    TableComponent,
    PageTableComponent,
    PasswordInputComponent,
    QRCodeComponent,
    OauthButtonsComponent
  ],

  providers: []
})
export class CoreComponentsModule {
}
