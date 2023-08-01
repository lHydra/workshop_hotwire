import { Controller } from "@hotwired/stimulus"
import { useDebounce } from 'stimulus-use'

export default class extends Controller {
  static values = { formPath: String };
  static targets = ["input", "link", "results", "searchResultFrame"]
  static debounces = [
    {
      name: 'search',
      wait: 300
    }
  ]

  initialize() {
    this.clearResults = this.clearResults.bind(this);
    this.hideResults = this.hideResults.bind(this);
    this.showResults = this.showResults.bind(this);
  }

  connect() {
    useDebounce(this)
    this.setupSearchListeners();
  }

  linkTargetConnected(element) {
    if (element.hasAttribute('data-turbo-frame')) {
      element.addEventListener('turbo:click', this.clearResults);
    } else {
      element.addEventListener('click', this.clearResults);
    }
  }

  linkTargetDisconnected(element) {
    if (element.hasAttribute('data-turbo-frame')) {
      element.removeEventListener('turbo:click', this.clearResults);
    } else {
      element.removeEventListener('click', this.clearResults);
    }
  }

  search(event) {
    if (this.formPathValue && event.target.value.length > 3) {
      const url = new URL(this.formPathValue);
      url.searchParams.set('q', event.target.value);

      Turbo.visit(url, { frame: "search_results" });
    }
  }

  setupSearchListeners() {
    this.inputTarget.addEventListener("focus", this.showResults);
    this.inputTarget.addEventListener("blur", this.hideResults);
    this.resultsTarget.addEventListener("mousedown", function(e) {
      e.preventDefault();
    })
  }

  async clearResults() {
    await new Promise((resolve) => setTimeout(() => resolve(), 0));

    this.searchResultFrameTarget.removeAttribute('src');
    if (this.hasInputTarget) {
      this.inputTarget.blur();
      this.inputTarget.value = "";
    }
    if (this.hasResultsTarget) {
      this.hideResults();
      this.resultsTarget.querySelectorAll("li").forEach(e => e.remove());
    }
  }

  hideResults() {
    this.resultsTarget.classList.add('hidden');
  }

  showResults() {
    this.resultsTarget.classList.remove('hidden');
  }
}
