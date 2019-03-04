import { Component, OnInit } from '@angular/core';
import { PricingService } from 'src/services/pricing.service';
import { AuthService } from 'src/services';
import { Hierarchy } from 'src/models/material';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-pricing',
  templateUrl: './pricing.component.html',
  styleUrls: ['./pricing.component.scss']
})
export class PricingComponent implements OnInit {
  materials: any[];
  organizationId: string;
  page: number;
  message: string;
  show = false;
  hierarchy: Hierarchy;
  isBlocked = true;


  constructor(private authService: AuthService, private pricingService: PricingService, private datePipe: DatePipe) {
    this.hierarchy = new Hierarchy();
  }

  ngOnInit() {
    this.page = 1;
    this.authService.isAuthenticated();
    this.authService.getOrganizationId().subscribe(id => this.setId(id));
  }

  setId(id) {
    this.organizationId = id;
    if (id !== undefined) {
      this.pricingService.getHierarchy(this.organizationId).subscribe(items => this.loadMaterials(items), error => error);
    } else {
      this.message =
        'Por favor, para utilizar este recurso primeiro, vá ate a tela de Materiais e cadastre-os';
      this.isBlocked = false;
      return;
    }
  }

  loadMaterials(items) {
    if (items.solid.materials[Hierarchy.types.glass].items.length <= 0
      && items.solid.materials[Hierarchy.types.isopor].items.length <= 0
      && items.solid.materials[Hierarchy.types.metal].items.length <= 0
      && items.solid.materials[Hierarchy.types.paper].items.length <= 0
      && items.solid.materials[Hierarchy.types.plastic].items.length <= 0
      && items.solid.materials[Hierarchy.types.tetrapack].items.length <= 0) {
      this.message =
        'Por favor, para utilizar este recurso, primeiro vá ate a tela de Materiais e cadastre-os';
      this.isBlocked = false;
      return;
    } else {
      this.hierarchy = items;
      this.setItems(items, Hierarchy.types.glass);
      this.setItems(items, Hierarchy.types.plastic);
      this.setItems(items, Hierarchy.types.paper);
      this.setItems(items, Hierarchy.types.metal);
      this.setItems(items, Hierarchy.types.tetrapack);
      this.setItems(items, Hierarchy.types.isopor);
    }
  }


  private setItems(items: any, type: any) {
    if (items.solid.materials[type].items !== undefined || items.solid.materials[type].items.length > 0) {
      if (items.solid.materials[type].items.length > 0) {
        items.solid.materials[type].items.forEach(item => {
          item.type = type;
          if (item.pricing.dateEntry !== undefined && item.pricing.price > 0) {
            item.blockChange = true;
          } else {
            item.blockChange = false;
          }
          if (this.materials === undefined || this.materials.length <= 0) {
            this.materials = [item];
          } else {
            this.materials.push(item);
          }
        });
        this.blockItems(this.materials);
      }
    }
  }


  blockItems(items) {
    items.forEach(item => {
      if (item._id !== undefined && item._id !== '' && item.pricing.dateEntry !== undefined) {
        item.pricing.disabled = 'disabled';
        item.pricing.dateEntry = this.datePipe.transform(item.pricing.dateEntry, 'dd/MM/yyyy');
      }
    });

  }

  calculatePrice(item) {
    if (item.pricing !== undefined && item.pricing.unitPrice.length > 0) {
      if (item.pricing.dateEntry !== undefined && item._id) {
        this.message =
          'Este item já foi salvo, e não pode ser alterado.';
        return;
      }
    }
    if (item.pricing.unitPrice[item.pricing.unitPrice.length - 1] > 0 && item.pricing.weight > 0) {
      item.pricing.price = item.pricing.weight * item.pricing.unitPrice[item.pricing.unitPrice.length - 1];
    } else {
      this.message =
        'Por favor, é necessário ter o valor unitário e o peso para calcular o preço final.';
    }
  }

  veryfyBeforeSave() {
    if (this.materials === undefined || this.materials.length <= 0) {
      throw new Error(
        'Por favor, preencha os campos antes de salvar os dados!'
      );
    }
    this.materials.forEach(item => {
      if (item.pricing.dateEntry !== undefined) {

        if ((item.pricing === undefined || item.pricing.unitPrice.length <= 0)) {
          throw new Error(
            'Por favor, preencha os campos antes de salvar os dados!'
          );
        }
        if (item.pricing.unitPrice[item.pricing.unitPrice.length - 1] <= 0 || item.pricing.weight <= 0 || item.pricing.price <= 0) {
          throw new Error(
            'Por favor, preencha os campos antes de salvar os dados!'
          );
        }
      }
      if (item.pricing.unitPrice[item.pricing.unitPrice.length - 1] <= 0 || item.pricing.date[item.pricing.date.length - 1] === undefined) {
        throw new Error(
          'Por favor, preencha os campos antes de salvar os dados!!'
        );
      }
      if (item.pricing.dateEntry === undefined && item.pricing.weight > 0) {
        throw new Error(
          'Por favor, preencha os campos antes de salvar os dados!!'
        );
      }
      if (item.pricing.dateEntry === undefined && item.pricing.price > 0) {
        throw new Error(
          'Por favor, preencha os campos antes de salvar os dados!!'
        );
      }
    });

  }

  private addToMaterial() {
    this.materials.forEach(itemMaterial => {
      if (itemMaterial.type === Hierarchy.types.glass) {
        this.insertValues(itemMaterial, Hierarchy.types.glass);
      } else if (itemMaterial.type === Hierarchy.types.isopor) {
        this.insertValues(itemMaterial, Hierarchy.types.isopor);
      } else if (itemMaterial.type === Hierarchy.types.metal) {
        this.insertValues(itemMaterial, Hierarchy.types.metal);
      } else if (itemMaterial.type === Hierarchy.types.paper) {
        this.insertValues(itemMaterial, Hierarchy.types.paper);
      } else if (itemMaterial.type === Hierarchy.types.plastic) {
        this.insertValues(itemMaterial, Hierarchy.types.plastic);
      } else if (itemMaterial.type === Hierarchy.types.tetrapack) {
        this.insertValues(itemMaterial, Hierarchy.types.tetrapack);
      }
    });
  }

  private insertValues(itemMaterial: any, type: string) {
    if (this.hierarchy.solid.materials[type].items !== undefined) {
      this.hierarchy.solid.materials[type].items.forEach((item, index) => {
        if (item._id === itemMaterial._id && !item.blockChange) {
          let obj = {
            _id: itemMaterial._id,
            name: itemMaterial.name,
            active: itemMaterial.active,
            pricing: itemMaterial.pricing
          };
          this.hierarchy.solid.materials[type].items[index] = obj;
        }
      });
    }
  }

  addDate(items) {
    items.forEach(item => {
      if (item.pricing.price > 0 && item.dateEntry === undefined) {
        item.pricing.dateEntry = new Date();
        item.pricing.disabled = 'disabled';
      }
    });
  }

  save() {
    try {
      let existToSave = this.materials.filter(x => x.blockChange === false);
      if (!existToSave === undefined || existToSave.length <= 0) {
        this.message = 'Nenhuma alteração foi realizada, todos os items já foram precificados!';
        return;
      }
      this.addDate(this.materials);
      this.veryfyBeforeSave();
      this.addToMaterial();
      this.pricingService.createOrUpdate(this.organizationId, this.hierarchy);
      this.message = 'Dados salvos com sucesso';
    } catch (error) {
      this.message = error;
      console.log(error);
    }
  }
}
