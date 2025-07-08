'use strict';

const sphereIcon = document.querySelector('dotlottie-player.menu__link-background');
const preloader = document.querySelector('.preloader');
const contentWrapper = document.querySelector('.body__container');
const creatingTablesForm = document.getElementById('create-tables-form');
const creatingTablesFormInput = document.getElementById('create-tables-password');
const overlay = document.querySelector('.viewport-overlay');

const passwordToSeeNumbers = 12345678;
let mutationObserver;
let scrollTimeout;
let lastScrollTop = 0;

// Code for faid animation  when skrolling
window.addEventListener('scroll', () => {
	const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
	const direction = scrollTop > lastScrollTop ? 'down' : (scrollTop < lastScrollTop ? 'up' : null);

	if (direction === 'down') {
		overlay.classList.remove('fade-in-top', 'fade-out', 'fade-out-top');
		overlay.classList.add('fade-in');
	} else if (direction === 'up') {
		overlay.classList.remove('fade-in', 'fade-out', 'fade-out-top');
		overlay.classList.add('fade-in-top');
	}

	lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;

	clearTimeout(scrollTimeout);

	scrollTimeout = setTimeout(() => {
		overlay.classList.remove('fade-in', 'fade-in-top');

		if (direction === 'down') {
			overlay.classList.add('fade-out');
		} else if (direction === 'up') {
			overlay.classList.add('fade-out-top');
		}
	}, 450);
});

// Code for graph in the block who-uses

const GRAPH_CONFIG = {
	// Конфигурация графика-кольца. Данные вводить сдесь ! 
	segments: [
		{ value: 35, label: 'Молодые 18+', color: 'var(--color-green-light)' },
		{ value: 30, label: 'Работники', color: 'var(--color-green)' },
		{ value: 20, label: 'Трейдеры', color: 'var(--color-blue)' },
		{ value: 15, label: 'Таксисты', color: 'var(--color-violet)' }
	],
	baseWidth: 44,
	baseHeight: 30,
	baseGraphWidth: 174,
	labelOffset: 45
};

function initGraph() {
	document.querySelectorAll('.who-uses__graph-image-value').forEach(el => el.remove());
	document.querySelectorAll('.metrics-list__item').forEach(el => el.remove());

	updateGraphData();
	updateGraphLabels();

	const resizeObserver = new ResizeObserver(updateGraphLabels);
	resizeObserver.observe(document.querySelector('.who-uses__graph-image'));
}
function updateGraphData() {
	const graphElement = document.querySelector('.who-uses__graph');
	const metricsList = document.querySelector('.metrics-list');

	document.querySelectorAll('.who-uses__graph-image-value').forEach(el => el.remove());
	metricsList.innerHTML = '';

	GRAPH_CONFIG.segments.forEach((segment, index) => {
		graphElement.style.setProperty(`--value-${index + 1}`, segment.value);

		const valueElement = document.createElement('span');
		valueElement.className = 'who-uses__graph-image-value';
		valueElement.dataset.value = segment.value;
		graphElement.querySelector('.who-uses__graph-image').appendChild(valueElement);

		const item = document.createElement('div');
		item.className = 'metrics-list__item';

		const valueDiv = document.createElement('dt');
		valueDiv.className = 'metrics-list__value';
		valueDiv.style.background = segment.color;
		valueDiv.textContent = `${segment.value}%`;

		const labelDiv = document.createElement('dd');
		labelDiv.className = 'metrics-list__name';
		labelDiv.textContent = segment.label;

		item.append(valueDiv, labelDiv);
		metricsList.appendChild(item);
	});
}

function updateGraphLabels() {
	const graph = document.querySelector('.who-uses__graph-image');
	const graphWidth = graph.offsetWidth;
	const scaleFactor = graphWidth / GRAPH_CONFIG.baseGraphWidth;

	const graphRadius = graphWidth / 2;
	const ringInner = graphRadius * 0.48;
	const ringThickness = graphRadius * (0.70 - 0.48);

	document.querySelectorAll('.who-uses__graph-image-value').forEach((element, index) => {
		const angle = calculateSegmentAngle(index);
		const radians = angle * (Math.PI / 180);
		const radius = ringInner + ringThickness / 2 + GRAPH_CONFIG.labelOffset * scaleFactor;

		element.style.cssText = `
      width: ${GRAPH_CONFIG.baseWidth * scaleFactor}px;
      height: ${GRAPH_CONFIG.baseHeight * scaleFactor}px;
      transform: translate(
        calc(${radius * Math.cos(radians)}px - 50%), 
        calc(${radius * Math.sin(radians)}px - 50%)
				);
				`;
	});
}

function calculateSegmentAngle(index) {
	let cumulativeSum = 0;
	for (let i = 0; i < index; i++) {
		cumulativeSum += GRAPH_CONFIG.segments[i].value;
	}
	return (cumulativeSum + GRAPH_CONFIG.segments[index].value / 2) * 3.6 - 90;
}

initGraph();

// Code for translate page ( Google Translate Widget )

const languages = {
	ru: () => {
		localStorage.setItem("language", "ru");
		setLanguage('ru');
	},
	en: () => {
		localStorage.setItem("language", "en");
		setLanguage('en');
	},
	ar: () => {
		localStorage.setItem("language", "en");
		setLanguage('ar');
	},
	cn: () => {
		localStorage.setItem("language", "en");
		setLanguage('zh-CN');
	}
};

window.addEventListener('load', () => {
	const lang = localStorage.getItem('language') || 'en';
	showPreloader();
	if (!localStorage.getItem('language')) {
		localStorage.setItem("language", "en");
		setLanguage('en');
	}
});

function setLanguage(lang) {
	contentWrapper.classList.add('hide-content');

	setTimeout(() => {
		showPreloader();
		document.cookie = "googtrans=/ru/" + lang;
		window.location.reload();
	}, 400);
}

document.getElementById('translate-to-english').addEventListener('click', languages.en);
document.getElementById('translate-to-arabic').addEventListener('click', languages.ar);
document.getElementById('translate-to-russian').addEventListener('click', languages.ru);
document.getElementById('translate-to-chinese').addEventListener('click', languages.cn);

// Code for plreloader and load page

function showPreloader() {
	preloader.classList.remove('hide-content');
	preloader.classList.add('show-content');


	if (!contentWrapper.classList.contains('visually-hidden')) {
		contentWrapper.classList.add('visually-hidden');
	}
	if (mutationObserver) {
		mutationObserver.disconnect();
	}

	if (localStorage.getItem("language", "ru")) {
		hidePreloader();
	}
	mutationObserver = new MutationObserver(() => {
		hidePreloader();
		mutationObserver.disconnect();
	});

	mutationObserver.observe(contentWrapper, { childList: true, subtree: true, characterData: true });
}

function hidePreloader() {
	preloader.classList.add('hide-content');

	setTimeout(() => {
		preloader.classList.add('visually-hidden');
		contentWrapper.classList.remove('visually-hidden');
		contentWrapper.classList.remove('hide-content');
		contentWrapper.classList.add('show-content');
	}, 2600);
}
// Code for creating secret tables ( form in block originality )
creatingTablesForm.addEventListener('submit', (e) => {
	e.preventDefault();
	const inputValue = creatingTablesFormInput.value.trim();

	if (inputValue === '') {
		creatingTablesFormInput.setCustomValidity('The password is too short');
		creatingTablesFormInput.reportValidity();
		creatingTablesFormInput.style.cssText = "background-color: var(--color-pink);";
		setTimeout(() => creatingTablesFormInput.removeAttribute('style'), 2000);
	}
	else if (Number(inputValue) !== passwordToSeeNumbers) {
		creatingTablesFormInput.setCustomValidity('The password is incorrect, try again...');
		creatingTablesFormInput.reportValidity();
		creatingTablesFormInput.style.cssText = "background-color: var(--color-pink);";
		setTimeout(() => creatingTablesFormInput.removeAttribute('style'), 2000);
	}
	else {
		addTablesToHtml();
		creatingTablesFormInput.value = '';
	}
});

creatingTablesFormInput.addEventListener('input', () => {
	creatingTablesFormInput.setCustomValidity('');
	creatingTablesFormInput.removeAttribute('style');
	creatingTablesFormInput.reportValidity();
});

function cellPainting(rowsList) {
	// Code for invest tables (painting colors of cells)
	rowsList.forEach(row => {
		const tds = row.querySelectorAll('td');
		for (let i = 1; i < tds.length; i++) {
			const cell = tds[i];
			const value = parseFloat(cell.textContent.replace(/\s/g, '').replace(',', '.'));
			if (!isNaN(value) && value < 0) {
				cell.style.cssText = "color: var(--color-red); background-color: var(--color-pink);";
			}
		}
	});
}

function addTablesToHtml() {
	const startPointDriving = document.querySelector('.originality');
	let investTablesSection = document.querySelector('.invest-indicators');

	if (startPointDriving && investTablesSection === null) {
		const tableSections = `
		<section class="numbers section">
<h2 class="visually-hidden">Цифры Mini-app Q</h2>

<div class="numbers__inner">

	<div class="numbers__top-tables-group">
		<h3 class="numbers__title title-big">Цифры Q</h3>

		<table class="numbers__table--readiness table">
			<caption class="numbers__table-title--readiness table__title">
				Готовность
			</caption>
			<thead class="table__head">
				<tr class="table__row table__row--head">
					<th>Блок</th>
					<th>Статус</th>
				</tr>
			</thead>
			<tbody>
				<tr class="table__row">
					<td>Бэк-енд</td>
					<td>100&nbsp;%</td>
				</tr>
				<tr class="table__row">
					<td>Фронт-енд</td>
					<td>100&nbsp;%</td>
				</tr>
				<tr class="table__row">
					<td>Интергация</td>
					<td>90&nbsp;%</td>
				</tr>
				<tr class="table__row">
					<td>Общая готовность продукта</td>
					<td>98&nbsp;%</td>
				</tr>
			</tbody>
		</table>

		<table class="numbers__table--metrics table">
			<caption class="numbers__table-title--metrics table__title">
				Ключевые метрики
			</caption>
			<thead class="table__head">
				<tr class="table__row table__row--head">
					<th>Показатель</th>
					<th>Значение</th>
				</tr>
			</thead>
			<tbody>
				<tr class="table__row">
					<td>CAC (ср.)</td>
					<td>7,15&nbsp;$</td>
				</tr>
				<tr class="table__row">
					<td>ARPU</td>
					<td>25,63&nbsp;$</td>
				</tr>
				<tr class="table__row">
					<td>LTV</td>
					<td>36,61&nbsp;$</td>
				</tr>
				<tr class="table__row">
					<td>LTV&nbsp;/ CAC</td>
					<td>5,12</td>
				</tr>
			</tbody>
		</table>
	</div>

	<table class="numbers__table--income-sources table">
		<caption class="numbers__table-title--income-sources table__title">
			Источники дохода
		</caption>

		<thead class="table__head">
			<tr class="table__row table__row--head">
				<th>Статья дохода</th>
				<th>%&nbsp;от&nbsp;оборота</th>
				<th>Комментарий</th>
			</tr>
		</thead>

		<tbody>
			<tr class="table__row">
				<td>Комиссия сети</td>
				<td>0,99&nbsp;$ за&nbsp;транзакцию</td>
				<td>стандарт для внутренних переходов</td>
			</tr>
			<tr class="table__row">
				<td>Комиссия за фьючерсы</td>
				<td>0,77&nbsp;% (после дисконта)</td>
				<td>включает партнёрскую скидку</td>
			</tr>
			<tr class="table__row">
				<td>Swap/финансирование</td>
				<td>1&nbsp;% в&nbsp;месяц на&nbsp;открытие позиции</td>
				<td>распределяется ежедневно</td>
			</tr>
		</tbody>
	</table>
</div>

<div class="numbers__decor-background section__decor-background "></div>
</section>

		<section class="forecast forecast--three-month section">
<h2 class="visually-hidden">Прогноз роста выручки Mini-app Q за 1-3 месяца</h2>

<div class="forecast__inner container">
	<table class="forecast__table calc-table">
		<caption class="calc-table__title">
			Прогноз роста выручки и пользовательской активности крипто-платформы (&nbsp;1-3 месяцев&nbsp;)
		</caption>

		<thead>
			<tr class="calc-table__row calc-table__row--head">
				<th>Месяц</th>
				<th>1</th>
				<th>2</th>
				<th>3</th>
			</tr>
		</thead>

		<tbody>
			<tr class="calc-table__row">
				<td>
					Доходная часть (по&nbsp;продуктам)
				</td>
				<td></td>
				<td></td>
				<td></td>
			</tr>

			<tr class="calc-table__row calc-table__row--color-green calc-table__row--black-border">
				<td>
					Выручка
				</td>
				<td>1000</td>
				<td>15 00</td>
				<td>50 000</td>
			</tr>

			<tr class="empty-row">
				<td></td>
				<td></td>
				<td></td>
				<td></td>
			</tr>

			<tr class="calc-table__row calc-table__row--gray-bg">
				<td>
					1. Крипто-платформа
				</td>
				<td></td>
				<td></td>
				<td></td>
			</tr>

			<tr class="calc-table__row">
				<td>
					Комиссия сети (0,19$)
				</td>
				<td>1 485</td>
				<td>16 335</td>
				<td>46 035</td>
			</tr>

			<tr class="calc-table__row">
				<td>
					Комиссия Futures после реферального бонуса (0,37%)
				</td>
				<td>363</td>
				<td>3 989</td>
				<td>11 243</td>
			</tr>

			<tr class="calc-table__row">
				<td>
					SWAP(1%)
				</td>
				<td>10</td>
				<td>700</td>
				<td>2 000</td>
			</tr>

			<tr class="empty-row">

				<td></td>
				<td></td>
				<td></td>
				<td></td>
			</tr>

			<tr class="empty-row">

				<td></td>
				<td></td>
				<td></td>
				<td></td>
			</tr>

			<tr class="calc-table__row calc-table__row--capt">
				<td>
					Активность пользователей
				</td>
				<td></td>
				<td></td>
				<td></td>
			</tr>

			<tr class="calc-table__row">
				<td>
					Привлеченные пользователи
				</td>
				<td>1 500</td>
				<td>15 000</td>
				<td>20 000</td>
			</tr>

			<tr class="calc-table__row">
				<td>
					Активные пользователи (20%) (шт)
				</td>
				<td>150</td>
				<td>1 500</td>
				<td>3 000</td>
			</tr>

			<tr class="calc-table__row">
				<td>
					Активы пользователей ($)
				</td>
				<td>3 500</td>
				<td>50 000</td>
				<td>200 000</td>
			</tr>

			<tr class="calc-table__row">
				<td>
					Количество транзакций (шт)
				</td>
				<td>1 000</td>
				<td>13 500</td>
				<td>26 500</td>
			</tr>

			<tr class="calc-table__row">
				<td>
					Активные клиенты (шт)
				</td>
				<td>35</td>
				<td>325</td>
				<td>1 225</td>
			</tr>

			<tr class="calc-table__row">
				<td>
					Активные клиенты после оттока (30%)
				</td>
				<td>50,0</td>
				<td>500,0</td>
				<td>1 300</td>
			</tr>
		</tbody>
	</table>
</div>

<div class="forecast__decor-background section__decor-background "></div>
</section>

		<section class="forecast forecast--six-month section">
<h2 class="visually-hidden">Прогноз роста выручки Mini-app Q за 4-6 месяца</h2>

<div class="forecast__inner container">
	<table class="forecast__table calc-table">
		<caption class="calc-table__title">
			Прогноз роста выручки и пользовательской активности крипто-платформы (&nbsp;4-6 месяцев&nbsp;)
		</caption>

		<thead>
			<tr class="calc-table__row calc-table__row--head">
				<th>Месяц</th>
				<th>4</th>
				<th>5</th>
				<th>6</th>
			</tr>
		</thead>

		<tbody>
			<tr class="calc-table__row">
				<td>
					Доходная часть (по&nbsp;продуктам)
				</td>
				<td></td>
				<td></td>
				<td></td>
			</tr>

			<tr class="calc-table__row calc-table__row--color-green calc-table__row--black-border">
				<td>
					Выручка
				</td>

				<td>222 222</td>
				<td>1 222 222</td>
				<td>3 222 222</td>
			</tr>

			<tr class="empty-row">

				<td></td>
				<td></td>
				<td></td>
				<td></td>
			</tr>

			<tr class="calc-table__row calc-table__row--gray-bg">
				<td>
					1. Крипто-платформа
				</td>
				<td></td>
				<td></td>
				<td></td>
			</tr>

			<tr class="calc-table__row">
				<td>
					Комиссия сети (0,99$)
				</td>
				<td>222 222</td>
				<td>1 222 222</td>
				<td>2 222 222</td>
			</tr>

			<tr class="calc-table__row">
				<td>
					Комиссия Futures после реферального бонуса (0,77%)
				</td>
				<td>33 333</td>
				<td>333 333</td>
				<td>333 333</td>
			</tr>

			<tr class="calc-table__row">
				<td>
					SWAP(1%)
				</td>
				<td>44 444</td>
				<td>54 555</td>
				<td>555 555</td>
			</tr>

			<tr class="empty-row">

				<td></td>
				<td></td>
				<td></td>
				<td></td>
			</tr>

			<tr class="empty-row">

				<td></td>
				<td></td>
				<td></td>
				<td></td>
			</tr>

			<tr class="calc-table__row calc-table__row--capt">
				<td>
					Активность пользователей
				</td>
				<td></td>
				<td></td>
				<td></td>
			</tr>

			<tr class="calc-table__row">
				<td>
					Привлеченные пользователи
				</td>
				<td>200 000</td>
				<td>500 000</td>
				<td>1 000 000</td>
			</tr>

			<tr class="calc-table__row">
				<td>
					Активные пользователи (15%) (шт)
				</td>
				<td>30 000</td>
				<td>75 000</td>
				<td>150 000</td>
			</tr>

			<tr class="calc-table__row">
				<td>
					Активы пользователей ($)
				</td>
				<td>1 555 555</td>
				<td>5 222 222</td>
				<td>19 333 333</td>
			</tr>

			<tr class="calc-table__row">
				<td>
					Количество транзакций (шт)
				</td>
				<td>150 000</td>
				<td>1 000 000</td>
				<td>2 000 000</td>
			</tr>

			<tr class="calc-table__row">
				<td>
					Активные клиенты (шт)
				</td>
				<td>20 000</td>
				<td>60 000</td>
				<td>150 000</td>
			</tr>

			<tr class="calc-table__row">
				<td>
					Активные клиенты после оттока (30%)
				</td>
				<td>17 000</td>
				<td>30 000</td>
				<td>90 000</td>
			</tr>
		</tbody>
	</table>
</div>

<div class="forecast__decor-background section__decor-background "></div>
</section>

		<section class="forecast forecast--nine-month section">
<h2 class="visually-hidden">Прогноз роста выручки Mini-app Q за 7-9 месяцев</h2>

<div class="forecast__inner container">
	<table class="forecast__table calc-table">
		<caption class="calc-table__title">
			Прогноз роста выручки и пользовательской активности крипто-платформы (&nbsp;7-9 месяцев&nbsp;)
		</caption>

		<thead>
			<tr class="calc-table__row calc-table__row--head">
				<th>Месяц</th>
				<th>7</th>
				<th>8</th>
				<th>9</th>
			</tr>
		</thead>

		<tbody>
			<tr class="calc-table__row">
				<td>
					Доходная часть (по&nbsp;продуктам)
				</td>
				<td></td>
				<td></td>
				<td></td>
			</tr>
			<tr class="calc-table__row calc-table__row--color-green calc-table__row--black-border">
				<td>
					Выручка
				</td>

				<td>6 222 222</td>
				<td>10 333 333</td>
				<td>15 555 555</td>
			</tr>

			<tr class="empty-row">
				<td></td>
				<td></td>
				<td></td>
				<td></td>
			</tr>

			<tr class="calc-table__row calc-table__row--gray-bg">
				<td>
					1. Крипто-платформа
				</td>
				<td></td>
				<td></td>
				<td></td>
			</tr>

			<tr class="calc-table__row">
				<td>
					Комиссия сети (0,99$)
				</td>
				<td>8 000 000</td>
				<td>9 000 000</td>
				<td>19 000 000</td>
			</tr>

			<tr class="calc-table__row">
				<td>
					Комиссия Futures после реферального бонуса (0,77%)
				</td>
				<td>2 000 000</td>
				<td>3 000 000</td>
				<td>4 000 000</td>
			</tr>

			<tr class="calc-table__row">
				<td>
					SWAP(1%)
				</td>
				<td>358 111</td>
				<td>706 111</td>
				<td>903 111</td>
			</tr>

			<tr class="empty-row">
				<td></td>
				<td></td>
				<td></td>
				<td></td>
			</tr>

			<tr class="empty-row">
				<td></td>
				<td></td>
				<td></td>
				<td></td>
			</tr>

			<tr class="calc-table__row calc-table__row--capt">
				<td>
					Активность пользователей
				</td>
				<td></td>
				<td></td>
				<td></td>
			</tr>

			<tr class="calc-table__row">
				<td>
					Привлеченные пользователи
				</td>
				<td>1 750 000</td>
				<td>2 000 000</td>
				<td>4 000 000</td>
			</tr>

			<tr class="calc-table__row">
				<td>
					Активные пользователи (15%) (шт)
				</td>
				<td>200 000</td>
				<td>300 000</td>
				<td>600 000</td>
			</tr>

			<tr class="calc-table__row">
				<td>
					Активы пользователей ($)
				</td>
				<td>15 000 000</td>
				<td>30 000 000</td>
				<td>40 000 000</td>
			</tr>

			<tr class="calc-table__row">
				<td>
					Количество транзакций (шт)
				</td>
				<td>2 000 000</td>
				<td>3 000 000</td>
				<td>17 000 500</td>
			</tr>

			<tr class="calc-table__row">
				<td>
					Активные клиенты (шт)
				</td>
				<td>200 000</td>
				<td>400 000</td>
				<td>700 000</td>
			</tr>

			<tr class="calc-table__row">
				<td>
					Активные клиенты после оттока (30%)
				</td>
				<td>111 000</td>
				<td></td>
				<td></td>
			</tr>
		</tbody>
	</table>
</div>

<div class="forecast__decor-background section__decor-background "></div>
</section>

		<section class="forecast forecast--twelve-month section">
<h2 class="visually-hidden">Прогноз роста выручки Mini-app Q за 10-12 месяцев</h2>

<div class="forecast__inner container">
	<table class="forecast__table calc-table">
		<caption class="calc-table__title">
			Прогноз роста выручки и пользовательской активности крипто-платформы (&nbsp;10-12 месяцев&nbsp;)
		</caption>

		<thead>
			<tr class="calc-table__row calc-table__row--head">
				<th>Месяц</th>
				<th>10</th>
				<th>11</th>
				<th>12</th>
			</tr>
		</thead>

		<tbody>
			<tr class="calc-table__row">
				<td>
					Доходная часть (по&nbsp;продуктам)
				</td>
				<td></td>
				<td></td>
				<td></td>
			</tr>

			<tr class="calc-table__row calc-table__row--color-green calc-table__row--black-border">
				<td>
					Выручка
				</td>

				<td>20 000 000</td>
				<td>60 000 000</td>
				<td>90 000 000</td>
			</tr>

			<tr class="empty-row">
				<td></td>
				<td></td>
				<td></td>
				<td></td>
			</tr>

			<tr class="calc-table__row calc-table__row--gray-bg">
				<td>
					1. Крипто-платформа
				</td>
				<td></td>
				<td></td>
				<td></td>
			</tr>

			<tr class="calc-table__row">
				<td>
					Комиссия сети (0,99$)
				</td>
				<td>22 777 777</td>
				<td>33 777 777</td>
				<td>77 777 777</td>
			</tr>

			<tr class="calc-table__row">
				<td>
					Комиссия Futures после реферального бонуса (0,77%)
				</td>
				<td>5 222 222</td>
				<td>8 333 333</td>
				<td>12 123 456</td>
			</tr>

			<tr class="calc-table__row">
				<td>
					SWAP(1%)
				</td>
				<td>1 000 000</td>
				<td>2 000 000</td>
				<td>3 000 000</td>
			</tr>

			<tr class="empty-row">
				<td></td>
				<td></td>
				<td></td>
				<td></td>
			</tr>

			<tr class="empty-row">
				<td></td>
				<td></td>
				<td></td>
				<td></td>
			</tr>

			<tr class="calc-table__row calc-table__row--capt">
				<td>
					Активность пользователей
				</td>
				<td></td>
				<td></td>
				<td></td>
			</tr>

			<tr class="calc-table__row">
				<td>
					Привлеченные пользователи
				</td>
				<td>6 000 000</td>
				<td>8 000 000</td>
				<td>10 000 000</td>
			</tr>

			<tr class="calc-table__row">
				<td>
					Активные пользователи (15%) (шт)
				</td>
				<td>300 000</td>
				<td>1 900 000</td>
				<td>3 500 000</td>
			</tr>

			<tr class="calc-table__row">
				<td>
					Активы пользователей ($)
				</td>
				<td>111 333 888</td>
				<td>222 444 444</td>
				<td>333 333 333</td>
			</tr>

			<tr class="calc-table__row">
				<td>
					Количество транзакций (шт)
				</td>
				<td>13 000 500</td>
				<td>25 000 500</td>
				<td>90 000 500</td>
			</tr>

			<tr class="calc-table__row">
				<td>
					Активные клиенты (шт)
				</td>
				<td>1 222 222</td>
				<td>2 222 222</td>
				<td>3 222 222</td>
			</tr>
		</tbody>
	</table>
</div>

<div class="forecast__decor-background forecast__decor-background--long section__decor-background "></div>
</section>

		<section class="invest-indicators section">
<h2 class="visually-hidden">Инвестиционные показатели Mini-app Q</h2>

<div class="invest-indicators__inner container">
	<table class="invest-indicators__table calc-table calc-table--invest" id="calc-table-invest-1">
		<caption class="calc-table__title calc-table__title--invest">
			Инвестиционные показатели (&nbsp;1-12 месяцев&nbsp;)
			<br>
			ROI <span class="calc-table__text calc-table__text--green">179.46%</span>
		</caption>

		<thead>
			<tr class="calc-table__row calc-table__row--head">
				<th>Месяц</th>
				<th>1</th>
				<th>2</th>
				<th>3</th>
			</tr>
		</thead>

		<tbody>
			<tr class="calc-table__row calc-table__row--bold calc-table__row--black-border">
				<td>
					Инвестиции
				</td>
				<td></td>
				<td></td>
				<td></td>
			</tr>

			<tr class="calc-table__row calc-table__row--yellow-title">
				<td>
					Расходы, $/мес
				</td>
				<td>236 000</td>
				<td>27 000</td>
				<td>167 000</td>
			</tr>

			<tr class="calc-table__row calc-table__row--yellow-title calc-table__row--right">
				<td>
					ФОТ
				</td>
				<td>23 850</td>
				<td>23 850</td>
				<td>23 850</td>
			</tr>

			<tr class="calc-table__row calc-table__row--yellow-title calc-table__row--right">
				<td>
					Реферальная система
				</td>
				<td>351</td>
				<td>5 262</td>
				<td>53 283</td>
			</tr>

			<tr class="calc-table__row calc-table__row--yellow-title calc-table__row--right">
				<td>
					Нейросети
				</td>
				<td>3</td>
				<td>33</td>
				<td>65</td>
			</tr>

			<tr class="calc-table__row calc-table__row--yellow-title calc-table__row--right">
				<td>
					Социальная инженерия
				</td>
				<td>12 000</td>
				<td>12 000</td>
				<td>200 000</td>
			</tr>

			<tr class="calc-table__row calc-table__row--yellow-title calc-table__row--right">
				<td>
					Copeex (data centr)
				</td>
				<td>717 000</td>
				<td></td>
				<td></td>
			</tr>

			<tr class="empty-row">
				<td></td>
				<td></td>
				<td></td>
				<td></td>
			</tr>

			<tr class="calc-table__row calc-table__row--yellow-title">
				<td>
					Доходы, $/мес
				</td>
				<td></td>
				<td>2 922</td>
				<td>61 141</td>
			</tr>

			<tr class="calc-table__row calc-table__row--cash-balance">
				<td class="calc-table__row-title calc-table__row-title--red">
					Баланс денежных средств
				</td>
				<td>-776 000</td>
				<td>-35 000</td>
				<td>-126 000</td>
			</tr>

			<tr class="empty-row">
				<td></td>
				<td></td>
				<td></td>
				<td></td>
			</tr>

			<tr class="calc-table__row calc-table__row--cash-balance">
				<td class="calc-table__row-title">
					Денежные средства на&nbsp;конец периода
				</td>
				<td>-226 000</td>
				<td>-361 000</td>
				<td>-417 000</td>
			</tr>

			<tr class="calc-table__row calc-table__row--blue">
				<td>
					Инвестиции
				</td>
				<td>3 500 00</td>
				<td></td>
				<td></td>
			</tr>

			<tr class="calc-table__row calc-table__row--cash-balance">
				<td class="calc-table__row-title">
					Баланс денежных средств с учётом инвестиций
				</td>
				<td>3 000 000</td>
				<td>2 000 000</td>
				<td>2 000 000</td>
			</tr>
		</tbody>
	</table>
	<div class="block-text__decor-devider section__decor-background"></div>
	<table class="invest-indicators__table calc-table calc-table--invest" id="calc-table-invest-2">
		<caption class="visually-hidden">
			Таблица инвестиционных показателей Mini-app Q за 3- 6 месяцев
		</caption>

		<thead>
			<tr class="calc-table__row calc-table__row--head">
				<th>Месяц</th>
				<th>4</th>
				<th>5</th>
				<th>6</th>
			</tr>
		</thead>

		<tbody>
			<tr class="calc-table__row calc-table__row--bold calc-table__row--black-border">
				<td>
					Инвестиции
				</td>
				<td></td>
				<td></td>
				<td></td>
			</tr>

			<tr class="calc-table__row calc-table__row--yellow-title">
				<td>
					Расходы, $/мес
				</td>
				<td>123 222</td>
				<td>323 222</td>
				<td>1 123 222</td>
			</tr>

			<tr class="calc-table__row calc-table__row--yellow-title calc-table__row--right">
				<td>
					ФОТ
				</td>
				<td>23 200</td>
				<td>23 200</td>
				<td>23 200</td>
			</tr>

			<tr class="calc-table__row calc-table__row--yellow-title calc-table__row--right">
				<td>
					Реферальная система
				</td>
				<td>243 100</td>
				<td>612 036</td>
				<td>1 700 112</td>
			</tr>

			<tr class="calc-table__row calc-table__row--yellow-title calc-table__row--right">
				<td>
					Нейросети
				</td>
				<td>250</td>
				<td>1 725</td>
				<td>2 350</td>
			</tr>

			<tr class="calc-table__row calc-table__row--yellow-title calc-table__row--right">
				<td>
					Социальная инженерия
				</td>
				<td>1 172</td>
				<td>9 637</td>
				<td>19 768</td>
			</tr>

			<tr class="calc-table__row calc-table__row--yellow-title calc-table__row--right">
				<td>
					Copeex (data centr)
				</td>
				<td></td>
				<td></td>
				<td></td>
			</tr>

			<tr class="empty-row">
				<td></td>
				<td></td>
				<td></td>
				<td></td>
			</tr>

			<tr class="calc-table__row calc-table__row--yellow-title">
				<td>
					Доходы, $/мес
				</td>
				<td>19 580</td>
				<td>123 964</td>
				<td>7 234 927</td>
			</tr>

			<tr class="calc-table__row calc-table__row--cash-balance">
				<td class="calc-table__row-title calc-table__row-title--red">
					Баланс денежных средств
				</td>
				<td>-959 791</td>
				<td>-125 684</td>
				<td>99 946</td>
			</tr>

			<tr class="empty-row">
				<td></td>
				<td></td>
				<td></td>
				<td></td>
			</tr>

			<tr class="calc-table__row calc-table__row--cash-balance">
				<td class="calc-table__row-title">
					Денежные средства на&nbsp;конец периода
				</td>
				<td>-947 644</td>
				<td>-303 328</td>
				<td>-858 382</td>
			</tr>

			<tr class="calc-table__row calc-table__row--blue">
				<td>
					Инвестиции
				</td>
				<td></td>
				<td></td>
				<td></td>
			</tr>

			<tr class="calc-table__row calc-table__row--cash-balance">
				<td class="calc-table__row-title">
					Баланс денежных средств с учётом инвестиций
				</td>
				<td>2 746 084</td>
				<td>342 756</td>
				<td>184 374</td>
			</tr>
		</tbody>
	</table>
	<div class="block-text__decor-devider section__decor-background"></div>
	<table class="invest-indicators__table calc-table calc-table--invest" id="calc-table-invest-3">
		<caption class="visually-hidden">
			Таблица инвестиционных показателей Mini-app Q за 7 - 9 месяцев
		</caption>

		<thead>
			<tr class="calc-table__row calc-table__row--head">
				<th>Месяц</th>
				<th>7</th>
				<th>8</th>
				<th>9</th>
			</tr>
		</thead>

		<tbody>
			<tr class="calc-table__row calc-table__row--bold calc-table__row--black-border">
				<td>
					Инвестиции
				</td>
				<td></td>
				<td></td>
				<td></td>
			</tr>

			<tr class="calc-table__row calc-table__row--yellow-title">
				<td>
					Расходы, $/мес
				</td>
				<td>5 000 000</td>
				<td>7 000 000</td>
				<td>9 000 000</td>
			</tr>

			<tr class="calc-table__row calc-table__row--yellow-title calc-table__row--right">
				<td>
					ФОТ
				</td>
				<td>25 000</td>
				<td>25 000</td>
				<td>25 000</td>
			</tr>

			<tr class="calc-table__row calc-table__row--yellow-title calc-table__row--right">
				<td>
					Реферальная система
				</td>
				<td>3 222 222</td>
				<td>4 222 222</td>
				<td>9 222 222</td>
			</tr>

			<tr class="calc-table__row calc-table__row--yellow-title calc-table__row--right">
				<td>
					Нейросети
				</td>
				<td>7 000</td>
				<td>4 000</td>
				<td>9 000</td>
			</tr>

			<tr class="calc-table__row calc-table__row--yellow-title calc-table__row--right">
				<td>
					Социальная инженерия
				</td>
				<td>33 000</td>
				<td>44 333</td>
				<td>56 555</td>
			</tr>

			<tr class="calc-table__row calc-table__row--yellow-title calc-table__row--right">
				<td>
					Copeex (data centr)
				</td>
				<td></td>
				<td></td>
				<td></td>
			</tr>

			<tr class="empty-row">
				<td></td>
				<td></td>
				<td></td>
				<td></td>
			</tr>

			<tr class="calc-table__row calc-table__row--yellow-title">
				<td>
					Доходы, $/мес
				</td>
				<td>2 000 000</td>
				<td>4 322 111</td>
				<td>19 666 222</td>
			</tr>

			<tr class="calc-table__row calc-table__row--cash-balance">
				<td class="calc-table__row-title calc-table__row-title--red">
					Баланс денежных средств
				</td>
				<td>236 000</td>
				<td>3 111 222</td>
				<td>5 333 777</td>
			</tr>

			<tr class="empty-row">
				<td></td>
				<td></td>
				<td></td>
				<td></td>
			</tr>

			<tr class="calc-table__row calc-table__row--cash-balance">
				<td class="calc-table__row-title">
					Денежные средства на&nbsp;конец периода
				</td>
				<td>-300 000</td>
				<td>3 300 111</td>
				<td>6 333 222</td>
			</tr>

			<tr class="calc-table__row calc-table__row--blue">
				<td>
					Инвестиции
				</td>
				<td></td>
				<td></td>
				<td></td>
			</tr>

			<tr class="calc-table__row calc-table__row--cash-balance">
				<td class="calc-table__row-title">
					Баланс денежных средств с учётом инвестиций
				</td>
				<td>22 000</td>
				<td>3 333 222</td>
				<td>9 000 111</td>
			</tr>
		</tbody>
	</table>
	<div class="block-text__decor-devider section__decor-background"></div>
	<table class="invest-indicators__table calc-table calc-table--invest" id="calc-table-invest-4">
		<caption class="visually-hidden">
			Таблица инвестиционных показателей Mini-app Q за 10 - 12 месяцев
		</caption>

		<thead>
			<tr class="calc-table__row calc-table__row--head">
				<th>Месяц</th>
				<th>12</th>
				<th>15</th>
				<th>18</th>
			</tr>
		</thead>

		<tbody>
			<tr class="calc-table__row calc-table__row--bold calc-table__row--black-border">
				<td>
					Инвестиции
				</td>
				<td></td>
				<td></td>
				<td></td>
			</tr>

			<tr class="calc-table__row calc-table__row--yellow-title">
				<td>
					Расходы, $/мес
				</td>
				<td>13 000 000</td>
				<td>19 333 222</td>
				<td>27 111 333</td>
			</tr>

			<tr class="calc-table__row calc-table__row--yellow-title calc-table__row--right">
				<td>
					ФОТ
				</td>
				<td>25 000</td>
				<td>25 000</td>
				<td>25 000</td>
			</tr>

			<tr class="calc-table__row calc-table__row--yellow-title calc-table__row--right">
				<td>
					Реферальная система
				</td>
				<td>13 444 555</td>
				<td>16 444 555</td>
				<td>35 444 555</td>
			</tr>

			<tr class="calc-table__row calc-table__row--yellow-title calc-table__row--right">
				<td>
					Нейросети
				</td>
				<td>11 500</td>
				<td>16 000</td>
				<td>26 500</td>
			</tr>

			<tr class="calc-table__row calc-table__row--yellow-title calc-table__row--right">
				<td>
					Социальная инженерия
				</td>
				<td>111 000</td>
				<td>120 000</td>
				<td>250 000</td>
			</tr>

			<tr class="calc-table__row calc-table__row--yellow-title calc-table__row--right">
				<td>
					Copeex (data centr)
				</td>
				<td></td>
				<td></td>
				<td></td>
			</tr>

			<tr class="empty-row">
				<td></td>
				<td></td>
				<td></td>
				<td></td>
			</tr>

			<tr class="calc-table__row calc-table__row--yellow-title">
				<td>
					Доходы, $/мес
				</td>
				<td>28 000 000</td>
				<td>39 000 000</td>
				<td>45 000 000</td>
			</tr>

			<tr class="calc-table__row calc-table__row--cash-balance">
				<td class="calc-table__row-title calc-table__row-title--red">
					Баланс денежных средств
				</td>
				<td>3 111 111</td>
				<td>11 000 000</td>
				<td>14 000 000</td>
			</tr>

			<tr class="empty-row">
				<td></td>
				<td></td>
				<td></td>
				<td></td>
			</tr>

			<tr class="calc-table__row calc-table__row--cash-balance">
				<td class="calc-table__row-title">
					Денежные средства на&nbsp;конец периода
				</td>
				<td>17 111 222</td>
				<td>27 111 222</td>
				<td>33 111 222</td>
			</tr>

			<tr class="calc-table__row calc-table__row--blue">
				<td>
					Инвестиции
				</td>
				<td></td>
				<td></td>
				<td></td>
			</tr>

			<tr class="calc-table__row calc-table__row--cash-balance">
				<td class="calc-table__row-title">
					Баланс денежных средств с учётом инвестиций
				</td>
				<td>20 000 000</td>
				<td>30 000 000</td>
				<td>60 000 000</td>
			</tr>
		</tbody>
	</table>
</div>

<div class="invest-indicators__decor-background section__decor-background "></div>
</section>
`;
		startPointDriving.insertAdjacentHTML('afterend', tableSections);
		investTablesSection = document.querySelector('.invest-indicators');
		const investTableBalanceRows = investTablesSection.querySelectorAll('.calc-table__row--cash-balance');

		cellPainting(investTableBalanceRows);
		const hideSections = document.querySelectorAll('section.hide-content');
		hideSections.forEach(section => {
			setTimeout(() => {
				section.classList.remove('hide-content');
				section.classList.add('show-content');
			}, 400);

		});
	} else {
		console.log('There is already a table instance on the page...');
	}
};



