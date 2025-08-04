import React, { useState, useEffect } from 'react';
import css from './FAQSection.module.css';

const faqTranslations = {
  pl: {
    title: "Częste pytania",
    tabs: {
      general: "Pytania ogólne",
      cleaning: "O sprzątaniu",
      payment: "Płatność i zamawianie",
      additional: "Dodatkowe usługi",
    },
    faq: {
      general: [
        {
          question: "Czy oferujecie usługi sprzątania w weekendy?",
          answer: "Tak, oferujemy usługi sprzątania w weekendy. Możesz wybrać dogodny termin podczas zamawiania przez nasz kalkulator na stronie. Pracujemy w soboty i niedziele, aby dostosować się do Twojego harmonogramu, a także oferujemy elastyczne godziny, aby zapewnić maksymalną wygodę. Jeśli masz szczególne wymagania, skontaktuj się z nami, a postaramy się znaleźć najlepsze rozwiązanie.",
        },
        {
          question: "Czy mogę zamówić sprzątanie na konkretną godzinę?",
          answer: "Tak, możesz wybrać preferowaną godzinę podczas składania zamówienia. Postaramy się dopasować do Twojego harmonogramu, zapewniając, że nasi pracownicy przyjadą dokładnie o wybranej porze. Jeśli wybrany termin będzie niedostępny, skontaktujemy się z Tobą, aby uzgodnić inną godzinę. Dbamy o to, aby sprzątanie odbyło się w dogodnym dla Ciebie czasie.",
        },
        {
          question: "Czy wasi pracownicy są zweryfikowani?",
          answer: "Tak, wszyscy nasi pracownicy przechodzą dokładną weryfikację. Każdy z nich jest sprawdzany pod kątem kwalifikacji i doświadczenia, a także przechodzi kontrolę przeszłości kryminalnej. Ponadto nasze usługi są ubezpieczone na 1 mln zł, co gwarantuje bezpieczeństwo Twojego mienia. Możesz mieć pewność, że nasi pracownicy są profesjonalni i godni zaufania.",
        },
      ],
      cleaning: [
        {
          question: "Jakie usługi sprzątania oferujecie?",
          answer: "Oferujemy szeroki zakres usług sprzątania, które możesz wybrać za pomocą naszego kalkulatora na stronie. Wśród nich znajdziesz sprzątanie standardowe mieszkań i domów, sprzątanie po remontach, mycie okien, a także sprzątanie domów prywatnych i biur. Każda z tych usług jest dostosowana do Twoich potrzeb, a nasi pracownicy używają profesjonalnych środków i sprzętu, aby zapewnić najwyższą jakość. Jeśli masz dodatkowe pytania, skontaktuj się z nami, a chętnie wyjaśnimy szczegóły.",
        },
        {
          question: "Czy sprzątacie po remontach?",
          answer: "Tak, oferujemy sprzątanie po remontach. Możesz wybrać tę usługę w naszym kalkulatorze pod nazwą 'Mieszkanie po remoncie'. Zajmujemy się dokładnym sprzątaniem po pracach budowlanych, w tym usuwaniem pyłu, resztek farby, kleju czy innych zabrudzeń. Nasi pracownicy mają doświadczenie w tego typu zadaniach i używają specjalistycznego sprzętu, aby Twoje mieszkanie lśniło czystością po zakończeniu remontu.",
        },
        {
          question: "Czy myjecie okna?",
          answer: "Tak, oferujemy profesjonalne mycie okien. Możesz zamówić tę usługę przez nasz kalkulator w sekcji 'Mycie okien'. Używamy specjalnych środków i narzędzi, które zapewniają idealnie czyste okna bez smug. Mycie obejmuje zarówno szyby, jak i ramy okienne, a nasi pracownicy dbają o to, aby efekt był perfekcyjny. Jeśli masz okna na wysokościach, poinformuj nas, a zorganizujemy odpowiednie zabezpieczenia.",
        },
      ],
      payment: [
        {
          question: "Jakie metody płatności akceptujecie?",
          answer: "Akceptujemy różne metody płatności, aby zapewnić Ci maksymalną wygodę. Możesz zapłacić online przelewem bankowym lub kartą kredytową za pośrednictwem naszego bezpiecznego systemu płatności. Oferujemy również możliwość płatności gotówką po zakończeniu sprzątania, jeśli wolisz tę opcję. Wszystkie szczegóły dotyczące płatności znajdziesz podczas składania zamówienia w naszym kalkulatorze.",
        },
        {
          question: "Czy mogę otrzymać fakturę za sprzątanie?",
          answer: "Tak, na życzenie wystawiamy faktury VAT. Prosimy o podanie danych do faktury podczas składania zamówienia, takich jak nazwa firmy, NIP oraz adres. Faktura zostanie wysłana na Twój adres e-mail po zakończeniu usługi. Jeśli masz dodatkowe wymagania dotyczące faktury, takie jak szczególne uwagi czy inne dane, skontaktuj się z nami, a postaramy się je uwzględnić.",
        },
        {
          question: "Czy oferujecie zniżki za regularne sprzątanie?",
          answer: "Tak, oferujemy zniżki za regularne sprzątanie. Jeśli zdecydujesz się na cykliczne usługi, takie jak sprzątanie raz w tygodniu lub co dwa tygodnie, możesz skorzystać z rabatu na każdą kolejną wizytę. Szczegóły znajdziesz w sekcji 'Zniżki za częstotliwość' na naszej stronie. Dodatkowo oferujemy specjalne promocje dla stałych klientów, aby docenić ich lojalność wobec naszej firmy.",
        },
      ],
      additional: [
        {
          question: "Czy oferujecie sprzątanie dużych domów lub biur?",
          answer: "Tak, oferujemy sprzątanie zarówno dużych domów prywatnych, jak i biur. Możesz wybrać odpowiednią usługę w naszym kalkulatorze – 'Sprzątanie domu prywatnego' dla domów lub 'Sprzątanie biura' dla przestrzeni biurowych. Zajmujemy się dokładnym sprzątaniem dużych powierzchni, w tym czyszczeniem podłóg, mebli, okien i innych elementów. Nasi pracownicy dostosowują się do specyficznych wymagań każdego klienta, aby zapewnić najwyższą jakość usługi.",
        },
        {
          question: "Czy sprzątacie przestrzenie zewnętrzne, takie jak balkony?",
          answer: "Tak, sprzątamy przestrzenie zewnętrzne, w tym balkony, tarasy i patio. Usuwamy brud, liście, kurz oraz inne zanieczyszczenia, aby Twoje przestrzenie zewnętrzne były czyste i gotowe do użytku. Używamy odpowiednich środków i sprzętu, takich jak myjki ciśnieniowe, jeśli jest to potrzebne. Tę usługę możesz zamówić jako dodatek do sprzątania mieszkania lub jako samodzielną usługę. Skontaktuj się z nami, aby omówić szczegóły.",
        },
        {
          question: "Czy zajmujecie się sprzątaniem po imprezach?",
          answer: "Tak, oferujemy sprzątanie po imprezach i wydarzeniach. Zajmujemy się dokładnym sprzątaniem po przyjęciach, w tym usuwaniem śmieци, myciem naczyń, czyszczeniem podłóg i innych powierzchni. Nasi pracownicy pracują швидко и efektywnie, aby przywrócić porządek в Twoim domu lub lokalu po imprezie. Możesz zamówić tę usługę з wyprzedzeniem lub в trybie pilnym, а my postaramy się zorganizować sprzątanie в найkrótszym можливым czasie.",
        },
      ],
    },
  },
  uk: {
    title: "Часті питання",
    tabs: {
      general: "Загальні питання",
      cleaning: "Про прибирання",
      payment: "Оплата та замовлення",
      additional: "Додаткові послуги",
    },
    faq: {
      general: [
        {
          question: "Чи працюєте ви у вихідні?",
          answer: "Так, ми пропонуємо послуги прибирання у вихідні. Ви можете обрати зручний час під час замовлення через наш калькулятор на сайті. Ми працюємо в суботу та неділю, щоб підлаштуватися під ваш графік, і пропонуємо гнучкі години для максимальної зручності. Якщо у вас є особливі побажання, зв’яжіться з нами, і ми знайдемо найкраще рішення для вас.",
        },
        {
          question: "Чи можу я замовити прибирання на конкретну годину?",
          answer: "Так, ви можете обрати бажаний час під час оформлення замовлення. Ми постараємося підлаштуватися під ваш графік, щоб наші працівники прибули точно у вибраний час. Якщо обраний час буде недоступний, ми зв’яжемося з вами, щоб узгодити інший час. Ми дбаємо про те, щоб прибирання відбувалося у зручний для вас момент, без затримок.",
        },
        {
          question: "Чи перевірені ваші працівники?",
          answer: "Так, усі наші працівники проходять ретельну перевірку. Кожен з них перевіряється на наявність досвіду та кваліфікації, а також проходить перевірку кримінального минулого. Крім того, наші послуги застраховані на 1 млн злотих, що гарантує безпеку вашого майна. Ви можете бути впевнені, що наші працівники є професійними та надійними.",
        },
      ],
      cleaning: [
        {
          question: "Які послуги прибирання ви пропонуєте?",
          answer: "Ми пропонуємо широкий спектр послуг прибирання, які доступні через наш калькулятор на сайті. Ви можете замовити звичайне прибирання квартир і будинків, прибирання після ремонту, миття вікон, а також прибирання приватних будинків і офісів. Кожна послуга адаптується під ваші потреби, а наші працівники використовують професійні засоби та обладнання для забезпечення найвищої якості. Якщо у вас є додаткові питання, звертайтесь до нас, і ми з радістю надамо деталі.",
        },
        {
          question: "Чи прибираєте ви після ремонту?",
          answer: "Так, ми пропонуємо прибирання після ремонту. Ви можете обрати цю послугу в нашому калькуляторі під назвою 'Прибирання після ремонту'. Ми займаємося ретельним прибиранням після будівельних робіт, зокрема видаленням пилу, залишків фарби, клею чи інших забруднень. Наші працівники мають досвід у таких завданнях і використовують спеціалізоване обладнання, щоб ваше приміщення сяяло чистотою після ремонту.",
        },
        {
          question: "Чи миєте ви вікна?",
          answer: "Так, ми пропонуємо професійне миття вікон. Ви можете замовити цю послугу через наш калькулятор у розділі 'Миття вікон'. Ми використовуємо спеціальні засоби та інструменти, які забезпечують ідеально чисті вікна без розводів. Миття включає як скло, так і рами вікон, а наші працівники дбають про те, щоб результат був бездоганним. Якщо у вас вікна на висоті, повідомте нас, і ми організуємо необхідні заходи безпеки.",
        },
      ],
      payment: [
        {
          question: "Які методи оплати ви приймаєте?",
          answer: "Ми приймаємо різні методи оплати для вашої зручності. Ви можете оплатити онлайн банківським переказом або карткою через нашу безпечну систему платежів. Також ми пропонуємо можливість оплати готівкою після завершення прибирання, якщо вам так зручніше. Усі деталі щодо оплати ви знайдете під час оформлення замовлення в нашому калькуляторі. Якщо у вас є додаткові питання, звертайтеся до нас!",
        },
        {
          question: "Чи можу я отримати рахунок-фактуру за прибирання?",
          answer: "Так, за вашим запитом ми видаємо рахунки-фактури VAT. Будь ласка, вкажіть дані для рахунку під час оформлення замовлення, зокрема назву компанії, NIP та адресу. Рахунок буде надіслано на вашу електронну пошту після завершення послуги. Якщо у вас є додаткові вимоги до рахунку, наприклад, особливі примітки чи інші дані, зв’яжіться з нами, і ми врахуємо ваші побажання.",
        },
        {
          question: "Чи є у вас знижки за регулярне прибирання?",
          answer: "Так, ми пропонуємо знижки за регулярне прибирання. Якщо ви оберете періодичні послуги, наприклад, прибирання раз на тиждень або раз на два тижні, ви отримаєте знижку на кожне наступне прибирання. Деталі можна знайти в розділі 'Знижки за частоту' на нашому сайті. Також ми пропонуємо спеціальні акції для постійних клієнтів, щоб віддячити за вашу лояльність до нашої компанії.",
        },
      ],
      additional: [
        {
          question: "Чи прибираєте ви великі будинки або офіси?",
          answer: "Так, ми пропонуємо прибирання як великих приватних будинків, так і офісів. Ви можете обрати відповідну послугу в нашому калькуляторі – 'Прибирання приватного будинку' для будинків або 'Прибирання офісу' для офісних приміщень. Ми займаємося ретельним прибиранням великих площ, включно з чищенням підлоги, меблів, вікон та інших елементів. Наші працівники враховують специфічні вимоги кожного клієнта, щоб забезпечити найвищу якість послуги.",
        },
        {
          question: "Чи прибираєте ви зовнішні простори, такі як балкони?",
          answer: "Так, ми прибираємо зовнішні простори, зокрема балкони, тераси та патіо. Ми видаляємо бруд, листя, пил та інші забруднення, щоб ваші зовнішні простори були чистими та готовими до використання. Ми використовуємо відповідні засоби та обладнання, наприклад, мийки високого тиску, якщо це необхідно. Цю послугу можна замовити як додаток до прибирання квартири або як окрему послугу. Зв’яжіться з нами, щоб обговорити деталі.",
        },
        {
          question: "Чи займаєтеся ви прибиранням після вечірок?",
          answer: "Так, ми пропонуємо прибирання після вечірок і заходів. Ми займаємося ретельним прибиранням після святкувань, зокрема видаленням сміття, миттям посуду, чищенням підлоги та інших поверхонь. Наші працівники працюють швидко та ефективно, щоб повернути порядок у вашому домі чи приміщенні після вечірки. Ви можете замовити цю послугу заздалегідь або терміново, і ми зробимо все можливе, щоб організувати прибирання якомога швидше.",
        },
      ],
    },
  },
  ru: {
    title: "Часто задаваемые вопросы",
    tabs: {
      general: "Общие вопросы",
      cleaning: "Об уборке",
      payment: "Оплата и заказ",
      additional: "Дополнительные услуги",
    },
    faq: {
      general: [
        {
          question: "Работаете ли вы в выходные?",
          answer: "Да, мы предлагаем услуги уборки в выходные. Вы можете выбрать удобное время при заказе через наш калькулятор на сайте. Мы работаем в субботу и воскресенье, чтобы подстроиться под ваш график, и предлагаем гибкие часы для максимального удобства. Если у вас есть особые пожелания, свяжитесь с нами, и мы найдем лучшее решение для вас.",
        },
        {
          question: "Могу ли я заказать уборку на конкретное время?",
          answer: "Да, вы можете выбрать желаемое время при оформлении заказа. Мы постараемся подстроиться под ваш график, чтобы наши сотрудники прибыли точно в выбранное время. Если выбранное время будет недоступно, мы свяжемся с вами, чтобы согласовать другое время. Мы заботимся о том, чтобы уборка происходила в удобное для вас время, без задержек.",
        },
        {
          question: "Проверены ли ваши сотрудники?",
          answer: "Да, все наши сотрудники проходят тщательную проверку. Каждый из них проверяется на наличие опыта и квалификации, а также проходит проверку криминального прошлого. Кроме того, наши услуги застрахованы на 1 млн злотых, что гарантирует безопасность вашего имущества. Вы можете быть уверены, что наши сотрудники профессиональны и надежны.",
        },
      ],
      cleaning: [
        {
          question: "Какие услуги уборки вы предлагаете?",
          answer: "Мы предлагаем широкий спектр услуг уборки, доступных через наш калькулятор на сайте. Вы можете заказать стандартную уборку квартир и домов, уборку после ремонта, мойку окон, а также уборку частных домов и офисов. Каждая услуга адаптируется под ваши потребности, а наши сотрудники используют профессиональные средства и оборудование для обеспечения высочайшего качества. Если у вас есть дополнительные вопросы, обращайтесь к нам, и мы с радостью предоставим детали.",
        },
        {
          question: "Убираете ли вы после ремонта?",
          answer: "Да, мы предлагаем уборку после ремонта. Вы можете выбрать эту услугу в нашем калькуляторе под названием 'Уборка после ремонта'. Мы занимаемся тщательной уборкой после строительных работ, включая удаление пыли, остатков краски, клея и других загрязнений. Наши сотрудники имеют опыт в таких задачах и используют специализированное оборудование, чтобы ваше помещение сияло чистотой после ремонта.",
        },
        {
          question: "Моете ли вы окна?",
          answer: "Да, мы предлагаем профессиональную мойку окон. Вы можете заказать эту услугу через наш калькулятор в разделе 'Мойка окон'. Мы используем специальные средства и инструменты, которые обеспечивают идеально чистые окна без разводов. Мойка включает как стекла, так и рамы окон, а наши сотрудники заботятся о том, чтобы результат был безупречным. Если у вас окна на высоте, сообщите нам, и мы организуем необходимые меры безопасности.",
        },
      ],
      payment: [
        {
          question: "Какие способы оплаты вы принимаете?",
          answer: "Мы принимаем различные способы оплаты для вашего удобства. Вы можете оплатить онлайн банковским переводом или картой через нашу безопасную систему платежей. Также мы предлагаем возможность оплаты наличными после завершения уборки, если вам так удобнее. Все детали оплаты вы найдете при оформлении заказа в нашем калькуляторе. Если у вас есть дополнительные вопросы, обращайтесь к нам!",
        },
        {
          question: "Могу ли я получить счет за уборку?",
          answer: "Да, по вашему запросу мы выдаем счета-фактуры VAT. Пожалуйста, укажите данные для счета при оформлении заказа, включая название компании, NIP и адрес. Счет будет отправлен на ваш электронный адрес после завершения услуги. Если у вас есть дополнительные требования к счету, например, особые примечания или другие данные, свяжитесь с нами, и мы учтем ваши пожелания.",
        },
        {
          question: "Есть ли у вас скидки за регулярную уборку?",
          answer: "Да, мы предлагаем скидки за регулярную уборку. Если вы выберете периодические услуги, например, уборку раз в неделю или раз в две недели, вы получите скидку на каждую последующую уборку. Подробности можно найти в разделе 'Скидки за частоту' на нашем сайте. Также мы предлагаем специальные акции для постоянных клиентов, чтобы отблагодарить за вашу лояльность к нашей компании.",
        },
      ],
      additional: [
        {
          question: "Убираете ли вы большие дома или офисы?",
          answer: "Да, мы предлагаем уборку как больших частных домов, так и офисов. Вы можете выбрать соответствующую услугу в нашем калькуляторе – 'Уборка частного дома' для домов или 'Уборка офиса' для офисных помещений. Мы занимаемся тщательной уборкой больших площадей, включая чистку полов, мебели, окон и других элементов. Наши сотрудники учитывают специфические требования каждого клиента, чтобы обеспечить высочайшее качество услуги.",
        },
        {
          question: "Убираете ли вы наружные пространства, такие как балконы?",
          answer: "Да, мы убираем наружные пространства, включая балконы, террасы и патио. Мы удаляем грязь, листья, пыль и другие загрязнения, чтобы ваши наружные пространства были чистыми и готовыми к использованию. Мы используем подходящие средства и оборудование, например, мойки высокого давления, если это необходимо. Эту услугу можно заказать как дополнение к уборке квартиры или как отдельную услугу. Свяжитесь с нами, чтобы обсудить детали.",
        },
        {
          question: "Занимаетесь ли вы уборкой после вечеринок?",
          answer: "Да, мы предлагаем уборку после вечеринок и мероприятий. Мы занимаемся тщательной уборкой после празднований, включая удаление мусора, мытье посуды, чистку пола и других поверхностей. Наши сотрудники работают быстро и эффективно, чтобы восстановить порядок в вашем доме или помещении после вечеринки. Вы можете заказать эту услугу заранее или в срочном порядке, и мы сделаем все возможное, чтобы организовать уборку как можно скорее.",
        },
      ],
    },
  },
  en: {
    title: "Frequently Asked Questions",
    tabs: {
      general: "General Questions",
      cleaning: "About Cleaning",
      payment: "Payment and Ordering",
      additional: "Additional Services",
    },
    faq: {
      general: [
        {
          question: "Do you offer cleaning services on weekends?",
          answer: "Yes, we offer cleaning services on weekends. You can choose a convenient time when ordering through our calculator on the website. We work on Saturdays and Sundays to fit your schedule, offering flexible hours for maximum convenience. If you have specific requests, please contact us, and we will find the best solution for you.",
        },
        {
          question: "Can I book a cleaning for a specific time?",
          answer: "Yes, you can select your preferred time during the booking process. We will do our best to accommodate your schedule, ensuring our team arrives at the chosen time. If the selected time is unavailable, we will contact you to arrange an alternative time. We prioritize your convenience and aim to provide cleaning services at a time that suits you best.",
        },
        {
          question: "Are your employees verified?",
          answer: "Yes, all our employees undergo thorough background checks. Each team member is vetted for experience and qualifications, as well as screened for any criminal history. Additionally, our services are insured for 1 million PLN, ensuring the safety of your property. You can trust that our staff are professional and reliable, providing you with peace of mind.",
        },
      ],
      cleaning: [
        {
          question: "What cleaning services do you offer?",
          answer: "We offer a wide range of cleaning services available through our calculator on the website. You can book standard cleaning for apartments and houses, post-renovation cleaning, window cleaning, as well as cleaning for private homes and offices. Each service is tailored to your needs, and our team uses professional products and equipment to ensure the highest quality. If you have any additional questions, feel free to reach out, and we’ll gladly provide details.",
        },
        {
          question: "Do you clean after renovations?",
          answer: "Yes, we offer post-renovation cleaning. You can select this service in our calculator under 'Post-Renovation Cleaning'. We handle thorough cleaning after construction work, including removing dust, paint residues, glue, and other debris. Our team is experienced in such tasks and uses specialized equipment to ensure your space shines with cleanliness after the renovation.",
        },
        {
          question: "Do you clean windows?",
          answer: "Yes, we offer professional window cleaning. You can order this service through our calculator in the 'Window Cleaning' section. We use special products and tools to ensure your windows are spotless and streak-free. The cleaning includes both the glass and the frames, and our team ensures a perfect result. If your windows are at a height, let us know, and we will arrange the necessary safety measures.",
        },
      ],
      payment: [
        {
          question: "What payment methods do you accept?",
          answer: "We accept various payment methods for your convenience. You can pay online via bank transfer or credit card through our secure payment system. We also offer the option to pay in cash upon completion of the cleaning, if that’s more convenient for you. All payment details are available during the booking process in our calculator. Feel free to reach out if you have any additional questions!",
        },
        {
          question: "Can I get an invoice for the cleaning?",
          answer: "Yes, we can issue VAT invoices upon request. Please provide your billing details during the booking process, including the company name, NIP, and address. The invoice will be sent to your email after the service is completed. If you have specific requirements for the invoice, such as additional notes or other details, please let us know, and we will accommodate your needs.",
        },
        {
          question: "Do you offer discounts for regular cleaning?",
          answer: "Yes, we offer discounts for regular cleaning. If you opt for recurring services, such as weekly or bi-weekly cleaning, you’ll receive a discount on each subsequent visit. You can find details in the 'Frequency Discounts' section on our website. We also provide special promotions for loyal customers to show our appreciation for your continued trust in our services.",
        },
      ],
      additional: [
        {
          question: "Do you clean large homes or offices?",
          answer: "Yes, we offer cleaning for both large private homes and offices. You can select the appropriate service in our calculator – 'Private House Cleaning' for homes or 'Office Cleaning' for office spaces. We handle thorough cleaning of large areas, including floors, furniture, windows, and other elements. Our team takes into account each client’s specific requirements to ensure the highest quality service.",
        },
        {
          question: "Do you clean outdoor spaces like balconies?",
          answer: "Yes, we clean outdoor spaces, including balconies, terraces, and patios. We remove dirt, leaves, dust, and other debris to ensure your outdoor areas are clean and ready for use. We use appropriate products and equipment, such as pressure washers when needed. This service can be added to your apartment cleaning or booked as a standalone option. Contact us to discuss the details.",
        },
        {
          question: "Do you handle cleaning after parties?",
          answer: "Yes, we offer cleaning services after parties and events. We take care of thorough cleaning after celebrations, including removing trash, washing dishes, and cleaning floors and other surfaces. Our team works quickly and efficiently to restore order to your home or venue after the party. You can book this service in advance or on short notice, and we’ll do our best to arrange the cleaning as soon as possible.",
        },
      ],
    },
  },
};

const FAQSection = ({ lang = "pl", id }) => {
  const [activeTab, setActiveTab] = useState('general');
  const [activeIndex, setActiveIndex] = useState(0); // First question open by default

  const { title, tabs, faq } = faqTranslations[lang] || faqTranslations.pl;

  const splitTitle = (str) => {
    const words = str.split(" ");
    return [words.slice(0, -1).join(" "), words.at(-1)];
  };

  const [titleFirst, titleLast] = splitTitle(title);

  useEffect(() => {
    // Ensure the first question is open when switching tabs
    setActiveIndex(0);
  }, [activeTab]);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className={css.faqSection} id={id}>
      <div className={css.container}>
        <h2 className={css.title}>
          {titleFirst} <span className={css.highlightedTitle}>{titleLast}</span>
        </h2>
        <div className={css.tabs}>
          {Object.keys(tabs).map((tabKey) => (
            <button
              key={tabKey}
              className={`${css.tabButton} ${activeTab === tabKey ? css.activeTab : ''}`}
              onClick={() => {
                setActiveTab(tabKey);
              }}
            >
              {tabs[tabKey]}
            </button>
          ))}
        </div>
        <div className={`${css.faqList} ${activeIndex !== null ? css.expanded : ''}`}>
          {faq[activeTab].map((item, index) => (
            <div
              key={index}
              className={`${css.faqItem} ${activeIndex === index ? css.active : ''}`}
            >
              <button
                className={css.faqQuestion}
                onClick={() => toggleFAQ(index)}
                aria-expanded={activeIndex === index}
              >
                <span className={css.arrowIcon}>
                  {activeIndex === index ? '▲' : '▼'}
                </span>
                <span>{item.question}</span>
              </button>
              <div className={css.faqAnswer}>
                <div className={css.faqAnswerContent}>
                  <p>{item.answer}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;