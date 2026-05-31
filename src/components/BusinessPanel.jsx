export function BusinessPanel({ businessToday, onUpdateBusiness }) {
  return (
    <section className="panel">
      <p className="label">Бизнес</p>
      <h2>WB и продажи вне WB</h2>

      <div className="businessHero">
        <div>
          <small>Товар</small>
          <strong>{businessToday.mainProduct || "Главный товар не указан"}</strong>
        </div>

        <div>
          <small>WB</small>
          <strong>{businessToday.wbOrders || 0} заказов</strong>
        </div>

        <div>
          <small>Вне WB</small>
          <strong>{businessToday.outsideOrders || 0} продаж</strong>
        </div>
      </div>

      <div className="reportGrid">
        <label>
          Заказы WB
          <input
            value={businessToday.wbOrders}
            onChange={(event) => onUpdateBusiness("wbOrders", event.target.value)}
            placeholder="Например: 2"
          />
        </label>

        <label>
          Продажи вне WB
          <input
            value={businessToday.outsideOrders}
            onChange={(event) => onUpdateBusiness("outsideOrders", event.target.value)}
            placeholder="Например: 1"
          />
        </label>

        <label>
          Выкупы
          <input
            value={businessToday.buyouts}
            onChange={(event) => onUpdateBusiness("buyouts", event.target.value)}
            placeholder="Например: 1"
          />
        </label>

        <label>
          Отзывы
          <input
            value={businessToday.reviews}
            onChange={(event) => onUpdateBusiness("reviews", event.target.value)}
            placeholder="Например: 30"
          />
        </label>

        <label>
          WhatsApp-статусы
          <input
            value={businessToday.whatsappStatuses}
            onChange={(event) => onUpdateBusiness("whatsappStatuses", event.target.value)}
            placeholder="Например: 3"
          />
        </label>

        <label>
          Главный товар
          <input
            value={businessToday.mainProduct}
            onChange={(event) => onUpdateBusiness("mainProduct", event.target.value)}
            placeholder="Название товара"
          />
        </label>
      </div>

      <label className="fullLabel">
        Главный бизнес-шаг сегодня
        <textarea
          value={businessToday.mainAction}
          onChange={(event) => onUpdateBusiness("mainAction", event.target.value)}
          placeholder="Например: изучить 5 конкурентов и выписать, почему у них покупают"
        />
      </label>

      <label className="fullLabel">
        Что мешает продажам?
        <textarea
          value={businessToday.obstacle}
          onChange={(event) => onUpdateBusiness("obstacle", event.target.value)}
          placeholder="Например: карточка не идеальная, мало отзывов, нет денег на фото"
        />
      </label>

      <label className="fullLabel">
        Итог по бизнесу
        <textarea
          value={businessToday.result}
          onChange={(event) => onUpdateBusiness("result", event.target.value)}
          placeholder="Что сделал по факту?"
        />
      </label>
    </section>
  );
}
