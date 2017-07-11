import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { ItemExemplarComponent } from "./item-exemplar.component";
import { ItemScoringService } from "./item-scoring.service";
import { ItemScoringGuideMapper } from "./item-scoring-guide.mapper";
import { DataService } from "../../../shared/data/data.service";
import { MockDataService } from "../../../../test/mock.data.service";

describe('ItemExemplarComponent', () => {
  let component: ItemExemplarComponent;
  let fixture: ComponentFixture<ItemExemplarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemExemplarComponent ],
      providers: [ ItemScoringService, ItemScoringGuideMapper, { provide: DataService, useClass: MockDataService } ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemExemplarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
