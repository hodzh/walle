import { Resource } from "./resource";
import { Observable } from "rxjs/Observable";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { IDocument } from "./document";

export interface IDataSource<TDocument extends IDocument> {
  documents: Observable<TDocument[]>;
  loading: boolean;
  remove(document): Observable<boolean>;
  refresh(document): Observable<TDocument>;
  create(data): Observable<TDocument>;
  update(document, data): Observable<TDocument>;
  read(): Observable<TDocument[]>;
}

export class DataSource<TDocument extends IDocument> implements IDataSource<TDocument> {
  public get documents(): Observable<TDocument[]> {
    return this.documentsSubject.asObservable();
  }

  public loading: boolean;

  constructor(public resource: Resource<TDocument>) {
    this.documentsSubject = new BehaviorSubject<TDocument[]>([]);
  }

  public remove(document): Observable<boolean> {
    this.loading = true;
    var req = this.resource.remove(document._id);
    req.subscribe(
      (res) => {
        if (res) {
          var rows = this.documentsSubject.getValue()
            .filter(item => item !== document);
          this.documentsSubject.next(rows);
        }
        this.loading = false;
      },
      (error) => {
        console.log(error);
        this.loading = false;
      }
    );
    return req;
  }

  public refresh(document): Observable<TDocument> {
    this.loading = true;
    var req = this.resource.get(document._id);
    req.subscribe(
      (doc) => {
        this.onDocumentChanged(doc);
        this.loading = false;
      },
      (error) => {
        console.log(error);
        this.loading = false;
      }
    );
    return req;
  }

  public create(data): Observable<TDocument> {
    this.loading = true;
    var req = this.resource.create(data);
    req.subscribe(
      (doc) => {
        var rows = this.documentsSubject.getValue().concat(doc);
        this.documentsSubject.next(rows);
        this.loading = false;
      },
      (error) => {
        console.log(error);
        this.loading = false;
      }
    );
    return req;
  }

  public update(document, data): Observable<TDocument> {
    this.loading = true;
    var req = this.resource.update(document._id, data);
    req.subscribe(
      (document) => {
        this.onDocumentChanged(document);
        this.loading = false;
      },
      (error) => {
        console.log(error);
        this.loading = false;
      }
    );
    return req;
  }

  public read(): Observable<TDocument[]> {
    //this.loadingSubject.next(true);
    this.loading = true;
    let query = {};
    let req = this.resource.query(query);
    req.subscribe(
      (docs) => {
        this.documentsSubject.next(docs);
        this.loading = false;
      },
      (error) => {
        console.log(error);
        this.loading = false;
      }
    );
    return req;
  }

  protected documentsSubject: BehaviorSubject<TDocument[]>;

  protected onDocumentChanged(doc) {
    var rows = this.documentsSubject.getValue()
      .map((row: TDocument) => {
        return row._id === doc._id ? doc : row;
      });
    this.documentsSubject.next(rows);
  }
}

export class DataSourceDecorator<TDocument extends IDocument> implements IDataSource<TDocument> {

  constructor(protected dataSource: IDataSource<TDocument>) {
  }

  get documents(): Observable<TDocument[]> {
    return this.dataSource.documents;
  }

  get loading(): boolean {
    return this.dataSource.loading;
  }

  remove(document): Observable<boolean> {
    return this.dataSource.remove(document);
  }

  refresh(document): Observable<TDocument> {
    return this.dataSource.refresh(document);
  }

  create(data): Observable<TDocument> {
    return this.dataSource.create(data);
  }

  update(document, data): Observable<TDocument> {
    return this.dataSource.update(document, data);
  }

  read(): Observable<TDocument[]> {
    return this.dataSource.read();
  }
}

export interface FeaturedDataSourceOptions {
  autoUpdate?: boolean;
  autoUpdateMs?: number
}

export class FeaturedDataSource<TDocument extends IDocument>
extends DataSourceDecorator<IDocument> {

  constructor(protected dataSource: IDataSource<TDocument>,
              public options: FeaturedDataSourceOptions) {
    super(dataSource);
    this.featuredDocuments = this.dataSource.documents;
  }

  get documents(): Observable<TDocument[]> {
    return this.featuredDocuments;
  }

  startAutoUpdate() {
    const autoUpdateMs = 60000;
    this.autoUpdateInterval = setInterval(() => this.autoUpdate(), autoUpdateMs);
  }

  stopAutoUpdate() {
    clearInterval(this.autoUpdateInterval);
  }

  autoUpdate() {
    this.read();
  }

  private autoUpdateInterval;
  private featuredDocuments;
}
