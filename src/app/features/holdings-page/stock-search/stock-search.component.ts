import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Subject } from 'rxjs';

interface stockSuggestion {
  symbol: string;
  description: string;
  name: string;
}
@Component({
  selector: 'app-stock-search',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './stock-search.component.html',
  styleUrl: './stock-search.component.css',
})
export class stockSearchComponent {
  @Input() placeholder: string = 'Search stock symbol';
  @Output() symbolSelected = new EventEmitter<string>();
  @Input() disabled: boolean = false;

  // In stockSearchComponent

  searchQuery = '';
  suggestions: stockSuggestion[] = [];
  showSuggestions = false;
  isLoading = false;
  private searchTerms = new Subject<string>();

  @ViewChild('searchInput') searchInput!: ElementRef;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.searchTerms
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((term: string) => this.searchstocks(term))
      )
      .subscribe(
        (results) => {
          this.suggestions = results;
          this.isLoading = false;
        },
        (error) => {
          console.error('Error fetching suggestions:', error);
          this.clearSuggestions();
        }
      );
  }

  onSearchInput(): void {
    const query = this.searchQuery.trim();

    if (query) {
      this.isLoading = true;
      this.showSuggestions = true;
      this.searchTerms.next(query);
    } else {
      this.clearSuggestions();
    }
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.clearSuggestions();
    this.searchInput.nativeElement.focus();
  }

  private clearSuggestions(): void {
    this.suggestions = [];
    this.showSuggestions = false;
    this.isLoading = false;
  }

  searchstocks(query: string) {
    return this.http.get<stockSuggestion[]>(
      `http://localhost:5154/api/finnhub/search?q=${encodeURIComponent(query)}`
    );
  }

  selectSuggestion(suggestion: stockSuggestion): void {
    this.searchQuery = suggestion.symbol;
    this.symbolSelected.emit(suggestion.symbol);
    this.clearSuggestions();
  }
}
