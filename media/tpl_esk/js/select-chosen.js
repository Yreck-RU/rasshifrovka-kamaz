const SELECT_CHOSEN_SELECTED = 'chosen-selected-inner';
const SELECT_CHOSEN_SELECTED_MARKER = 'selected-marker-inner';
const SELECT_CHOSEN_SELECTED_TITLE = 'selected-title-inner';
const SELECT_CHOSEN_DROPDOWN = 'chosen-dropdown-inner';
const SELECT_CHOSEN_DROPDOWN_CONTENT = 'dropdown-content-inner';
const SELECT_CHOSEN_CONTENT_HEADER = 'content-header-inner';
const SELECT_CHOSEN_HEADER_TITLE = 'header-title-inner';
const SELECT_CHOSEN_HEADER_CLOSE = 'header-close-inner';
const SELECT_CHOSEN_CONTENT_SEARCH = 'content-search-inner';
const SELECT_CHOSEN_SEARCH_INPUT = 'search-input-inner';
const SELECT_CHOSEN_SEARCH_CLEAR = 'search-clear-inner';
const SELECT_CHOSEN_CONTENT_RESULT = 'content-result-inner';
const SELECT_CHOSEN_RESULT_OPTION = 'result-option-inner';
const SELECT_CHOSEN_RESULT_GROUP = 'result-group-inner';
const SELECT_CHOSEN_GROUP_TITLE = 'group-title-inner';
const SELECT_CHOSEN_GROUP_LIST = 'group-list-inner';
const SELECT_CHOSEN_RESULT_EMPTY = 'result-empty-inner';
const SELECT_CHOSEN_OPTION_MARKER = 'option-marker-inner';
const SELECT_CHOSEN_OPTION_TITLE = 'option-title-inner';

class SelectChosen extends EventTarget
{
    constructor(config, element)
    {
        super();

        this.element = element;
        this.options = new Array;

        this.config = Object.assign({
            value: '',
            autoClose: true,
            reload: false,
            enabledSearch: true,
            options: new Array,
            groups: new Array,
            language: {
                search_clear: 'Clear',
                search_empty: 'Nothing found!',
                search_hint: 'enter text to search...'
            }
        }, config);

        this.value = this.config.value;

        document.addEventListener('click', _ => {
            if (element.contains(event.target))
            {
                element.classList.add('focus');
            }
            else if (this.hasOwnProperty('selected'))
            {
                element.classList.remove('focus');
                this.selected.classList.remove('active');
            }
        });

        if (this.config.hasOwnProperty('selector_id'))
        {
            this.input_value = element.querySelector(
                this.config.selector_id
            );
        }
    }

    render()
    {
        this.selected = document.createElement('div');
        this.selected.classList.add(SELECT_CHOSEN_SELECTED);
        this.element.appendChild(this.selected);

        this.selected.addEventListener('click', _ => {
            this.selected.classList.add('active');
        });

        this.span_title = document.createElement('span');
        this.span_title.classList.add(SELECT_CHOSEN_SELECTED_TITLE);
        this.selected.appendChild(this.span_title);

        let selected = this.#_getSelectedOption();

        if (selected.hasOwnProperty('title'))
        {
            this.span_title.innerHTML = selected.title;
        }

        this.dropdown = document.createElement('div');
        this.dropdown.classList.add(SELECT_CHOSEN_DROPDOWN);
        this.element.appendChild(this.dropdown);

        this.content = document.createElement('div');
        this.content.classList.add(SELECT_CHOSEN_DROPDOWN_CONTENT);
        this.dropdown.appendChild(this.content);

        this.header = document.createElement('div');
        this.header.classList.add(SELECT_CHOSEN_CONTENT_HEADER);
        this.content.appendChild(this.header);

        this.header_title = document.createElement('div');
        this.header_title.classList.add(SELECT_CHOSEN_HEADER_TITLE);
        this.header.appendChild(this.header_title);

        this.title_span = document.createElement('span');
        this.title_span.innerHTML = this.config.label;
        this.header_title.appendChild(this.title_span);

        this.header_close = document.createElement('button');
        this.header_close.setAttribute('type', 'button');
        this.header_close.classList.add(SELECT_CHOSEN_HEADER_CLOSE);
        this.header.appendChild(this.header_close);

        this.header_close.addEventListener('click', _ => {
            this.selected.classList.remove('active');
        });

        if (this.config.enabledSearch === true)
        {
            this.#_renderSearchInner();
        }

        this.result = document.createElement('div');
        this.result.classList.add(SELECT_CHOSEN_CONTENT_RESULT);
        this.result.role = 'listbox';
        this.content.appendChild(this.result);

        for (const option of this.config.options)
        {
            let event = new CustomEvent('render.option', {
                detail: option, cancelable: true
            });

            event.element = this.result;

            if (this.element.dispatchEvent(event))
            {
                let inner = this.#_renderOptionInner(option);
                this.result.appendChild(inner);
            }
        }

        for (const group of this.config.groups)
        {
            group.inner = document.createElement('div');
            group.inner.classList.add(SELECT_CHOSEN_RESULT_GROUP);
            group.inner.role = 'group';
            group.inner.ariaLabel = group.title;
            this.result.appendChild(group.inner);

            group.span = document.createElement('span');
            group.span.classList.add(SELECT_CHOSEN_GROUP_TITLE);
            group.span.innerHTML = group.title;
            group.inner.appendChild(group.span);

            group.list = document.createElement('div');
            group.list.classList.add(SELECT_CHOSEN_GROUP_LIST);
            group.inner.appendChild(group.list);

            for (const option of group.options)
            {
                let event = new CustomEvent('render.option', {
                    detail: option, cancelable: true
                });

                event.element = this.result;

                if (this.element.dispatchEvent(event))
                {
                    let inner = this.#_renderOptionInner(option, group);
                    group.list.appendChild(inner);
                }
            }
        }

        // console.log(174, this);
    };

    clickOption(option)
    {
        this.#_clickOptionEvent(option);
    };

    #_renderSearchInner()
    {
        this.search_inner = document.createElement('div');
        this.search_inner.classList.add(SELECT_CHOSEN_CONTENT_SEARCH);
        this.content.appendChild(this.search_inner);

        this.search_input = document.createElement('input');
        this.search_input.classList.add(SELECT_CHOSEN_SEARCH_INPUT);

        if (this.config.language.hasOwnProperty('search_hint'))
        {
            this.search_input.setAttribute(
                'placeholder', this.config.language.search_hint
            );
        }

        this.search_input.addEventListener('keyup', _ => {
            this.#changeSearchInput(this.search_input);

            if (String(this.search_input.value).length > 0)
            {
                this.search_input.classList.add('focus');
            }
            else
            {
                this.search_input.classList.remove('focus');
            }
        });

        this.search_inner.appendChild(this.search_input);

        this.search_clear = document.createElement('button');
        this.search_clear.setAttribute('type', 'button');
        this.search_clear.classList.add(SELECT_CHOSEN_SEARCH_CLEAR);

        if (this.config.language.hasOwnProperty('search_clear'))
        {
            this.search_clear.innerHTML = this.config.language.search_clear;
        }

        this.search_clear.addEventListener('click', _ => {
            this.search_input.classList.remove('focus');
            this.search_input.value = '';

            let event = new KeyboardEvent('keyup');
            this.search_input.dispatchEvent(event);
        });

        this.search_inner.appendChild(this.search_clear);
    }

    #_renderOptionInner(option, group)
    {
        let item = Object.assign({}, option),
            value = this.value;

        if (this.hasOwnProperty('input_value'))
        {
            value = this.input_value.value;            
        }

        if (typeof group !== 'undefined')
        {
            item.group = group;
		}

        item.inner = document.createElement('div');
        item.inner.classList.add(SELECT_CHOSEN_RESULT_OPTION);
        item.inner.role = 'option';

        if ((value === option.value))
        {
            item.inner.ariaSelected = true;
            this.value = option.value;
        }
        else
        {
            item.inner.ariaSelected = false;
        }

        if (option.disabled === true)
        {
            item.inner.ariaDisabled = 'true';
        }

        item.span = document.createElement('span');
        item.span.classList.add(SELECT_CHOSEN_OPTION_TITLE);
        item.span.innerHTML = item.title;
        item.inner.appendChild(item.span);

        item.inner.addEventListener('click', _ => {
            this.#_clickOptionEvent(item);
        });

        this.options.push(item);
        return item.inner;
    }

    #_clickOptionEvent(option)
    {
        this.value = option.value;

        if (this.hasOwnProperty('input_value'))
        {
            this.input_value.value = option.value;
        }

        let event = new CustomEvent('change', {
            detail: option, cancelable: true
        });

        if (!this.element.dispatchEvent(event))
        {
            return;
        }

        for (const option of this.options)
        {
            option.inner.ariaSelected = 'false';
		}

        this.span_title.innerHTML = option.title;
        option.inner.ariaSelected = 'true';

        if (this.config.autoClose === true)
        {
            this.selected.classList.remove('active');
        }

        if (this.config.reload === true)
        {
            this.#_reloadForm(option);
        }
	}

    #_reloadForm(option)
    {
        if (!this.hasOwnProperty('form'))
        {
            this.form = this.element.closest('form');
        }

        let event = new CustomEvent('form.reload', {
            detail: option, cancelable: true
        });

        if (!this.element.dispatchEvent(event))
        {
            return false;
        }

        if (typeof this.form.task === 'undefined')
        {
            console.warn('Input name task not found!');
            return;
        }

        this.form.task.value = 'reload';
        this.form.submit();
    }

    #_getSelectedOption()
    {
        let value = this.value, items, options = [];

        if (this.hasOwnProperty('input_value'))
        {
            value = this.input_value.value;
        }

        for (const option of this.config.options)
        {
            options.push(option);
        }

        for (const group of this.config.groups)
        {
            if (!group.hasOwnProperty('options'))
            {
                continue;
            }

            if (group.options.length < 1)
            {
                continue;
            }

            for (const item of group.options)
            {
                options.push(item);
			}
        }

        // console.log(376, options, value);

        items = options.filter((o) => {
            return (o.value === value);
        });

        if (items.length > 0)
        {
            return items[0];
        }
        else if (options.length > 0)
        {
            return options[0];
		}

        return new Object;
    }

    #changeSearchInput(input)
    {
        let re1 = new RegExp(input.value, 'gi');
        let selected = 0, groups = [];

        for (const option of this.options)
        {
            if (option.hasOwnProperty('group')
                && groups.indexOf(option.group) === -1)
            {
                groups.push(option.group);
			}

            if (!option.hasOwnProperty('title'))
            {
                option.inner.style.display = 'none';
                option.span.innerHTML = option.title;

                return;
            }

            if (option.title.match(re1))
            {
                option.span.innerHTML = option.title.replace(re1, '<b>$&</b>');
                option.inner.style.display = 'flex';
                selected = (selected + 1);
            }
            else
            {
                option.span.innerHTML = option.title;
                option.inner.style.display = 'none';
            }
        }

        // console.log(376, groups);

        if (selected > 0)
        {
            // this.#result_empty.classList.remove('show');
		}
        else
		{
            // this.#result_empty.classList.add('show');
		}
	}
}

class SelectChosenElement extends HTMLElement
{
    connectedCallback()
    {
        if (this.classList.contains('disabled'))
        {
            console.warn('Element class disabled!', element);
            return;
        }

        let options = (config.get(this.id) || {});

        this.select = new SelectChosen(options, this);
        this.select.render();
    }
}

document.addEventListener('DOMContentLoaded', _ => {
    customElements.define('select-chosen', SelectChosenElement);
});