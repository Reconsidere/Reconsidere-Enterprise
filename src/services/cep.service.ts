import { Location } from './../models/location';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SignUpComponent } from 'src/app/auth/sign-up/sign-up.component';

@Injectable({
  providedIn: 'root'
})
export class CepService {
  private adrress: string[];
  constructor(private http: HttpClient) { }

  search(value: string, location: Location, page) {
    value = value.replace(/[^a-zA-Z0-9 ]/g, '');
    return this.http.get(`https://viacep.com.br/ws/${value}/json/`).subscribe(
      data => {
        this.convertToCEP(data, location);
        page.loading = false;
      },
      error => {
        console.log(error);
        page.loading = false;
      }
    );
  }
  private convertToCEP(cepNaResposta, location) {
    location.cep = cepNaResposta.cep;
    location.publicPlace = cepNaResposta.logradouro;
    location.complement = cepNaResposta.complemento;
    location.neighborhood = cepNaResposta.bairro;
    location.county = cepNaResposta.localidade;
    location.state = cepNaResposta.uf;
  }

  /*new serch method*/
  searchCep(value: string) {
    value = value.replace(/[^a-zA-Z0-9 ]/g, '');
    return this.http.get(`https://viacep.com.br/ws/${value}/json/`);
  }
}
