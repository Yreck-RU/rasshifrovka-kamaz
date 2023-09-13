/**
 * @copyright   2023 motokraft. MIT License
 * @homepage https://eurospeckam.ru/
 */

class Collection
{
	#_items = new Array;

	constructor(items = new Array)
	{
		items.forEach((item) => this.append(item));
	}

	append(item)
	{
		this.#_items.push(item);
	}

	map(func)
	{
		const result = new Collection;

		this.#_items.forEach((item, index) => {
			result.append(func(item, index));
		});

		return result;
	}

	filter(func)
	{
		const result = new Collection;

		this.#_items.forEach((item, index) => {
			if (func(item, index)) result.append(item);
		});

		return result;
	}

	each(func)
	{
		this.#_items.forEach((item, index) => func(item, index));
	}

	slice(begin, end)
	{
		return new Collection(this.#_items.slice(begin, end));
	}

	item(key)
	{
		if (this.has(key)) return this.#_items[key];
	}

	remove(key)
	{
		if (this.has(key)) delete this.#_items[key];
	}

	has(key)
	{
		return this.#_items.hasOwnProperty(key);
	}

	get length()
	{
		return Number(this.#_items.length);
	}

	get array()
	{
		const result = new Array;
		this.#_items.forEach((val) => result.push(val));

		return result;
	}
}