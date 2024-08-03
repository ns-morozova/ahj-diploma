const quotes = [
    "Кадры решают всё.",
    "Жить стало лучше, жить стало веселее.",
    "Без теории нам смерть, смерть, смерть.",
    "Я знаю, что после моей смерти на мою могилу нанесут много мусора, но ветер истории беспощадно развеет его!",
    "Народ и партия едины.",
    "Мы должны показать, что можем строить социализм быстрее и лучше, чем капиталисты.",
    "Враг будет разбит, победа будет за нами!",
    "Экономика должна быть экономной.",
    "Революцию делают не перчатками.",
    "Учиться, учиться и учиться!",
    "Мы не можем ждать милости от природы; взять их у неё – наша задача.",
    "Нет человека – нет проблемы.",
    "Смерть одного человека – это трагедия, смерть миллионов – это статистика.",
    "Без революционной теории не может быть и революционного движения.",
    "История учит, что история ничему не учит.",
    "Мы не можем позволить себе роскошь быть слабыми.",
    "Государство – это машина для подавления одного класса другим.",
    "Национализм – это детская болезнь, корь человечества.",
    "Дисциплина – мать победы.",
    "Война – это продолжение политики другими средствами.",
    "Кто не работает, тот не ест.",
    "Революция – это локомотив истории.",
    "Время работает на нас.",
    "Мы не можем жить в мире, где существует капитализм.",
    "Победа любой ценой!",
    "Мы должны быть готовы к войне.",
    "Великая революция требует великих жертв.",
    "Мы должны строить социализм в одной стране.",
    "Кто не с нами, тот против нас.",
    "Мы должны быть готовы к любым неожиданностям.",
    "Мы должны быть готовы к борьбе.",
    "Мы должны быть готовы к труду и обороне.",
    "Мы должны быть готовы к самопожертвованию.",
    "Мы должны быть готовы к борьбе за мир.",
    "Мы должны быть готовы к борьбе за социализм.",
    "Мы должны быть готовы к борьбе за коммунизм.",
    "Мы должны быть готовы к борьбе за справедливость.",
    "Мы должны быть готовы к борьбе за свободу.",
    "Мы должны быть готовы к борьбе за независимость.",
    "Мы должны быть готовы к борьбе за равенство.",
    "Мы должны быть готовы к борьбе за братство.",
    "Мы должны быть готовы к борьбе за счастье.",
    "Мы должны быть готовы к борьбе за будущее.",
    "Мы должны быть готовы к борьбе за прогресс.",
    "Мы должны быть готовы к борьбе за науку.",
    "Мы должны быть готовы к борьбе за культуру.",
    "Мы должны быть готовы к борьбе за образование.",
    "Мы должны быть готовы к борьбе за здравоохранение.",
    "Мы должны быть готовы к борьбе за спорт.",
    "Мы должны быть готовы к борьбе за искусство.",
    "Мы должны быть готовы к борьбе за литературу.",
    "Мы должны быть готовы к борьбе за музыку.",
    "Мы должны быть готовы к борьбе за театр.",
    "Мы должны быть готовы к борьбе за кино.",
    "Мы должны быть готовы к борьбе за телевидение.",
    "Мы должны быть готовы к борьбе за радио.",
    "Мы должны быть готовы к борьбе за печать.",
    "Мы должны быть готовы к борьбе за интернет.",
    "Мы должны быть готовы к борьбе за информацию.",
    "Мы должны быть готовы к борьбе за знания.",
    "Мы должны быть готовы к борьбе за мудрость.",
    "Мы должны быть готовы к борьбе за опыт.",
    "Мы должны быть готовы к борьбе за здоровье.",
    "Мы должны быть готовы к борьбе за силу.",
    "Мы должны быть готовы к борьбе за выносливость.",
    "Мы должны быть готовы к борьбе за ловкость.",
    "Мы должны быть готовы к борьбе за скорость.",
    "Мы должны быть готовы к борьбе за реакцию.",
    "Мы должны быть готовы к борьбе за координацию.",
    "Мы должны быть готовы к борьбе за равновесие.",
    "Мы должны быть готовы к борьбе за гибкость.",
    "Мы должны быть готовы к борьбе за технику.",
    "Мы должны быть готовы к борьбе за тактику.",
    "Мы должны быть готовы к борьбе за стратегию.",
    "Мы должны быть готовы к борьбе за планирование.",
    "Мы должны быть готовы к борьбе за организацию.",
    "Мы должны быть готовы к борьбе за управление.",
    "Мы должны быть готовы к борьбе за контроль.",
    "Мы должны быть готовы к борьбе за дисциплину.",
    "Мы должны быть готовы к борьбе за порядок.",
    "Мы должны быть готовы к борьбе за закон.",
    "Мы должны быть готовы к борьбе за справедливость.",
    "Мы должны быть готовы к борьбе за правду.",
    "Мы должны быть готовы к борьбе за честность.",
    "Мы должны быть готовы к борьбе за искренность.",
    "Мы должны быть готовы к борьбе за доброту.",
    "Мы должны быть готовы к борьбе за милосердие.",
    "Мы должны быть готовы к борьбе за сострадание.",
    "Мы должны быть готовы к борьбе за терпимость.",
    "Мы должны быть готовы к борьбе за уважение.",
    "Мы должны быть готовы к борьбе за любовь.",
    "Мы должны быть готовы к борьбе за мир.",
    "Мы должны быть готовы к борьбе за дружбу.",
    "Мы должны быть готовы к борьбе за сотрудничество.",
    "Мы должны быть готовы к борьбе за единство.",
    "Мы должны быть готовы к борьбе за солидарность."
];

export default function getRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    return quotes[randomIndex];
}