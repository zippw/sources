export default class Search {
    constructor(el, suggestionList, suggestionListItemsQuery = '.item') {
        this.el = el;
        this.suggestionList = suggestionList;
        this.suggestionListItemsQuery = suggestionListItemsQuery;
        this.bind();
        this.start();
    }

    start() {
        this.getSuggestions();
        this.setInputMaxLength();
    }

    bind() {
        this.el.addEventListener('focus', () => {
            this.el.parentElement.classList.add('expand', 'focus')
        });

        this.el.addEventListener('focusout', () => {
            if (this.el.value == '') this.el.parentElement.classList.remove('expand')
            this.el.parentElement.classList.remove('focus')
        });

        this.el.addEventListener('input', () => {
            const searchString = this.el.value.toLowerCase();

            const filteredSuggestions = this.suggestions.filter(suggestion =>
                suggestion.label.toLowerCase().includes(searchString)
            );

            this.displaySuggestions(filteredSuggestions, searchString);
        });
    }

    getSuggestions() {
        this.suggestions = Object.values(this.suggestionList.querySelectorAll(this.suggestionListItemsQuery))
            .map(function (x) {
                return {
                    label: x.querySelector('span.l-t')?.textContent,
                    href: x.href,
                    img: x.querySelector('.img img').src
                }
            });
    }

    setInputMaxLength() {
        let maxLength = 0;
        for (let i = 0; i < this.suggestions.length; i++) {
            if (this.suggestions[i].label.length > maxLength) maxLength = this.suggestions[i].label.length;
        };
        this.el.setAttribute('maxlength', maxLength);
    }

    displaySuggestions(filteredSuggestions, query) {
        // Clear previous suggestions
        while (this.suggestionList.firstChild) {
            this.suggestionList.removeChild(this.suggestionList.firstChild);
        }

        // Create new suggestion items
        filteredSuggestions.forEach((suggestion, i) => {
            const str = suggestion.label;
            let regex = new RegExp(query, "gi");
            let result = str.replace(regex, (match) => `<em>${match}</em>`);
            this.suggestionList.innerHTML += `<a class="item n-s" href="${suggestion.href}" data-hover-tile="0"><div class="l-s n-p n-s">${i + 1 >= 10 ? i + 1 : `0${i + 1}`}.</div><span class="l-t n-p n-s">${result || suggestion.label}</span><div class="l-i"><div class="img">${`<img class="n-s n-p" src="${suggestion.img}" alt="">`.repeat(3)}</div><svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M13.4885 4.56152L12.0775 5.97852L17.1205 10.9995H3.5415V12.9995H17.1195L12.0775 18.0215L13.4885 19.4385L20.9585 11.9995L13.4885 4.56152Z" fill="currentColor"></path></svg></div></a>`;
        });
    };
}