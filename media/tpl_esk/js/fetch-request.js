/**
 * @copyright   2023 motokraft. MIT License
 * @homepage https://eurospeckam.ru/
 */

class FetchRequest extends EventTarget
{
	#_alert = new AlertModel;
	#_result;

	get getFormData()
	{
		return new FormData;
	}

	async send(link, data, method = 'POST')
	{
		const headers = {
			'X-CSRF-Token': config.get('csrf.token')
		};

		const response = await fetch(link, {
			method: method, headers: headers,
			body: data
		});

		this.dispatchEvent(new CustomEvent(
			'before', { detail: response }
		));

		if (response.status !== 200)
		{
			this.dispatchEvent(new CustomEvent(
				'error', { detail: response }
			));

			return false;
		}

		try
		{
			this.#_result = await response.json();
		}
		catch (e)
		{
			this.dispatchEvent(new CustomEvent(
				'error_syntax', { detail: e }
			));

			console.error(e);
			return false;
		}

		this.dispatchEvent(new CustomEvent(
			'complete', { detail: this.#_result }
		));

		if (this.#_result.hasOwnProperty('message')
			&& this.#_result.message !== null)
		{
			this.dispatchEvent(new CustomEvent(
				'message', { detail: this.#_result }
			));

			this.#_alert.title = this.#_result.title;
			this.#_alert.innerHTML = this.#_result.message;
			this.#_alert.show();

			console.warn(this.#_result.message);
		}

		if (this.#_result.success === true)
		{
			this.dispatchEvent(new CustomEvent(
				'success', { detail: this.#_result }
			));
		}

		this.dispatchEvent(new CustomEvent(
			'after', { detail: this.#_result }
		));
	}
}