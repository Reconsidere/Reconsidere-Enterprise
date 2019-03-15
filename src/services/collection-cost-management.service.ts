import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ProcessingChain } from 'src/models/processingchain';

@Injectable({
  providedIn: 'root'
})
export class CollectionCostManagementService {

  constructor(private http: HttpClient) { }

  createOrUpdate(organizatioId: string, processingChain: ProcessingChain[]) {
    this.update(organizatioId, processingChain);
  }

  update(organizationId: string, processingChain: ProcessingChain[]) {
    this.http
      .put(
        environment.database.uri +
        `/organization/update/collectioncost/${organizationId}/`,
        processingChain
      )
      .subscribe(res => console.log('Done'));
  }

  getProcessingChain(id) {
    return this.http.get<any>(`${environment.database.uri}/organization/collectioncost/${id}`);
  }
}