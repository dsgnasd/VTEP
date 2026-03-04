// ──────────────────────────────────────────────────────────────
// Mock data — realistic VebTech employee data based on actual
// organizational structure and competency centers.
// Dates anchored around 2026-Q1 for the 3-month timeline.
// ──────────────────────────────────────────────────────────────

// Real VebTech departments (from org chart)
const TEAMS = [
  'Back-end',
  'Front-end',
  'QA',
  'Business Analysis',
  'Design',
  'DevOps/SysAdmin',
  'Equation/УОС',
  'Pega/BPM',
  'Architecture',
  'BI/Analytics',
  'IT Process',
  'Monitoring',
  'ETL',
  'Project Management',
  'Administration',
];

// Banking/fintech projects
const PROJECTS = [
  { id: 'proj-1', name: 'Интернет-банк 3.0' },
  { id: 'proj-2', name: 'КХД' },
  { id: 'proj-3', name: 'СИФР' },
  { id: 'proj-4', name: 'API Gateway' },
  { id: 'proj-5', name: 'Мобильный банк' },
  { id: 'proj-6', name: 'АБС Equation' },
  { id: 'proj-7', name: 'BPM/Pega Platform' },
  { id: 'proj-8', name: 'ITSM/Мониторинг' },
  { id: 'proj-9', name: 'Единый кабинет клиента' },
  { id: 'proj-10', name: 'CI/CD Pipeline' },
  { id: 'proj-11', name: 'Дизайн-система' },
  { id: 'proj-12', name: 'Кредитный конвейер' },
];

const SKILLS_POOL = [
  'Java', '.NET', 'C#', 'Python', 'Go', 'JavaScript', 'TypeScript',
  'React', 'Angular', 'Vue', 'Node.js', 'Spring Boot', 'Hibernate',
  'PostgreSQL', 'Oracle', 'MSSQL', 'MongoDB', 'Redis', 'Kafka',
  'Docker', 'Kubernetes', 'Terraform', 'Ansible', 'Jenkins', 'GitLab CI',
  'AWS', 'Azure',
  'Figma', 'Sketch', 'Adobe XD',
  'Pega', 'BPMN', 'Camunda',
  'Equation', 'COBOL',
  'Zabbix', 'Grafana', 'ELK', 'Prometheus',
  'SMAX', 'ITIL', 'ITSM',
  'Informatica', 'Talend', 'ETL',
  'Power BI', 'Tableau', 'QlikView',
  'Draw.io', 'Miro', 'Jira', 'Confluence',
  'Selenium', 'Postman', 'TestRail', 'JMeter',
  'REST', 'GraphQL', 'gRPC', 'SOAP',
  'Microservices', 'DDD', 'Clean Architecture',
  'Agile', 'Scrum', 'SAFe',
  'Swift', 'Kotlin',
];

const LEVELS = ['Junior', 'Middle', 'Senior'];
const STATUSES = ['Available', 'Partial', 'Vacation', 'Bench'];

const ACHIEVEMENT_POOL = [
  { title: 'Bug Hunter', icon: '🐛', description: 'Найдено 100+ багов' },
  { title: 'Ментор', icon: '🎓', description: 'Менторство 5+ джуниоров' },
  { title: 'Спикер', icon: '🎤', description: 'Выступление на митапе' },
  { title: 'Open Source', icon: '📦', description: 'Контрибьют в OSS' },
  { title: 'Пожарный', icon: '🔥', description: 'Решение критичного инцидента' },
  { title: 'Сертификат', icon: '📜', description: 'Профессиональная сертификация' },
  { title: 'Хакатон', icon: '🏆', description: 'Победа на хакатоне' },
  { title: '5 лет', icon: '⭐', description: '5 лет в компании' },
];

// ── Real employee data from VebTech wiki ──
// Format: [name, role, department_hint]
// department_hint maps to TEAMS index based on role keywords
const RAW_EMPLOYEES = [
  ['Агапова Каролина Евгеньевна', 'Специалист по персоналу', 14],
  ['Азарова Ксения Анриевна', 'Marketing Specialist', 14],
  ['Аксенчик Геннадий Александрович', '.NET Developer', 0],
  ['Алексеевич Александр Анатольевич', 'Руководитель проекта', 13],
  ['Аникин Евгений Константинович', 'Project Manager', 13],
  ['Анискович Наталия Леонидовна', 'Business Analyst', 3],
  ['Аркадан Дарин Аделевна', 'Lead Generation Manager', 14],
  ['Артименя Екатерина Григорьевна', 'Начальник финансового отдела', 14],
  ['Бабурин Дмитрий Александрович', 'Business Analyst', 3],
  ['Балабенко Анна Владимировна', 'Руководитель проекта', 13],
  ['Барейша Мария Геннадьевна', 'QA Engineer', 2],
  ['Барцевич Марина Ивановна', 'QA Pega', 2],
  ['Басик Иван Викторович', 'Ведущий инженер-программист', 0],
  ['Баталин Максим Сергеевич', 'Agile Coordinator', 14],
  ['Башкевич Святослав Дмитриевич', 'Equation Developer', 6],
  ['Белоцерковский Алексей Маратович', 'Ведущий инженер-программист', 8],
  ['Бендин Павел Александрович', 'Начальник отдела дизайна', 4],
  ['Березняк Алексей Константинович', 'System Analyst', 10],
  ['Бобков Илья Сергеевич', 'iOS Developer', 1],
  ['Богатырёв Олег Борисович', 'System Architect', 8],
  ['Бордюков Виталий Геннадьевич', 'Специалист по компьютерной графике', 4],
  ['Борисевич Сергей Анатольевич', 'Project Manager', 13],
  ['Бочаров Иван Глебович', 'Business Analyst', 3],
  ['Брезовская Ольга Викторовна', 'Начальник отдела QA', 2],
  ['Бруй Екатерина Вячеславовна', 'Business Analyst', 10],
  ['Брусочкина Наталия Валерьевна', 'Technical Writer', 3],
  ['Буйко Елена Евгеньевна', 'UX/UI Designer', 4],
  ['Бунас Юлия Фёдоровна', 'Java Developer', 0],
  ['Бурая Светлана Викторовна', 'Business Analyst', 3],
  ['Бурбо Ярослав Дмитриевич', 'Sales Manager', 14],
  ['Бурин Анна Андреевна', 'Project Manager', 13],
  ['Бушкевич Александр Васильевич', '.NET Developer', 0],
  ['Быховский Денис Игоревич', 'Lead Java Developer', 0],
  ['Вабищевич Екатерина Александровна', 'Business Analyst', 3],
  ['Варфоломеев Андрей Юрьевич', 'Agile Coach', 14],
  ['Василевский Дмитрий Владимирович', 'Project Manager', 13],
  ['Василевский Дмитрий Геннадьевич', 'Начальник отдела мониторинга', 11],
  ['Вежновец Елена Анатольевна', 'Business Analyst', 3],
  ['Величко Александр Владимирович', 'Начальник отдела BI', 9],
  ['Ветер Маргарита Александровна', 'Project Manager', 13],
  ['Виноградова Екатерина Александровна', 'Business Analyst', 3],
  ['Войтас Сергей Павлович', 'Начальник отдела Backend', 0],
  ['Волковский Кирилл Андреевич', 'Java Developer', 0],
  ['Воробей Надежда Николаевна', 'Business Analyst', 3],
  ['Высочанский Александр Андреевич', 'Head of Delivery / DevOps Lead', 5],
  ['Гаврош Ольга Олеговна', 'QA Engineer', 2],
  ['Галак Анастасия Дмитриевна', 'QA Engineer', 2],
  ['Гапоненко Антон Андреевич', 'Java Developer', 0],
  ['Гинь Андрей Игоревич', 'DevOps Engineer', 5],
  ['Глушаков Сергей Анатольевич', '.NET Developer', 0],
  ['Глушко Виталий Станиславович', 'Equation Developer', 6],
  ['Голубев Илья Сергеевич', 'Java Developer', 0],
  ['Гончаров Артём Андреевич', 'Frontend Developer', 1],
  ['Горбачёва Анастасия Валерьевна', 'QA Engineer', 2],
  ['Горбачик Виктория Олеговна', 'QA Engineer', 2],
  ['Горелик Кирилл Денисович', 'Equation Developer', 6],
  ['Горунов Александр Евгеньевич', 'Pega System Architect', 7],
  ['Гринцевич Юлия Михайловна', 'HR Director', 14],
  ['Громов Кирилл Евгеньевич', 'Sales Manager', 14],
  ['Грунтов Алексей Иванович', 'Java Developer', 0],
  ['Гузов Илья Кириллович', 'Frontend Developer', 1],
  ['Гулевич Наталья Александровна', 'QA Engineer', 2],
  ['Давидович Павел Олегович', 'Java Developer', 0],
  ['Данилеско Виктория Сергеевна', 'QA Engineer', 2],
  ['Дзик Пётр Иванович', 'ETL Developer', 12],
  ['Добриян Степан Михайлович', 'Java Developer', 0],
  ['Домаш Олеся Олеговна', 'Бухгалтер', 14],
  ['Дорофеев Артемий Николаевич', '.NET Developer', 0],
  ['Дубовик Наталия Дмитриевна', 'Business Analyst', 3],
  ['Дубровская Юлия Дмитриевна', 'QA Engineer', 2],
  ['Дудинский Антон Юрьевич', 'BI Developer', 9],
  ['Дуплянкин Александр Витальевич', 'Equation Developer', 6],
  ['Евтишенков Дмитрий Васильевич', 'BI Analyst', 9],
  ['Ермачёнок Марина Михайловна', 'Java Developer', 0],
  ['Ефимовых Андрей Дмитриевич', 'Equation Developer', 6],
  ['Жданович Мария Юрьевна', '.NET Developer', 0],
  ['Жук Вероника Валерьевна', 'Начальник отдела BA', 3],
  ['Жуковская Виолетта Игоревна', 'Business Analyst Intern', 3],
  ['Жуковский Никита Сергеевич', 'Java Developer', 0],
  ['Загоруев Максим Дмитриевич', '.NET Developer', 0],
  ['Зайков Юрий Евгеньевич', 'Frontend Developer', 1],
  ['Запольский Павел Александрович', 'BI Analyst', 9],
  ['Зарецкая Наталья Викторовна', 'Pega Developer', 7],
  ['Захаревич Виктор Анатольевич', 'Database Administrator', 5],
  ['Згирский Юрий Николаевич', 'Equation Developer', 6],
  ['Зданович Марина Владимировна', 'Business Analyst', 3],
  ['Зинькович Владислав Владимирович', 'Lead .NET Developer', 0],
  ['Зубрицкая Валентина Александровна', 'Business Analyst', 3],
  ['Зыль Никита Валерьевич', 'Ведущий инженер-программист', 0],
  ['Ильинчик Алексей Андреевич', 'Equation Developer', 6],
  ['Ишангулыев Даянч Миргельдыевич', 'Pega Developer', 7],
  ['Кабанов Андрей Сергеевич', 'Business Analyst', 3],
  ['Казакевич Сергей Викторович', 'Risk Manager', 14],
  ['Калиновская Ирина Викторовна', 'Business Analyst', 3],
  ['Каллаур Ирина Валерьевна', 'Начальник отдела Pega', 7],
  ['Касперович Сергей Викторович', 'Business Analyst', 3],
  ['Катько Владислав Юрьевич', 'Equation Developer', 6],
  ['Качан Александр Олегович', 'Frontend Developer', 1],
  ['Кашевар Кристина Леонидовна', 'QA Engineer', 2],
  ['Киреев Илья Олегович', 'Equation Developer', 6],
  ['Кислюк Кристина Сергеевна', 'QA Engineer', 2],
  ['Клименко Виктория Александровна', 'Business Analyst', 3],
  ['Козлов Александр Олегович', 'Зам. ГД по архитектуре ПО', 8],
  ['Козлов Виталий Игоревич', 'Java Developer', 0],
  ['Козловский Антон Николаевич', 'Pega Developer', 7],
  ['Козловский Евгений Александрович', 'System Architect', 8],
  ['Колос Владимир Владимирович', 'Monitoring Engineer', 11],
  ['Конохова Надежда Андреевна', 'Project Manager', 13],
  ['Копыльцова Ирина Витальевна', 'QA Engineer', 2],
  ['Коротченко Елена Александровна', 'Business Analyst', 3],
  ['Костюкевич Никита Геннадьевич', 'Java Developer', 0],
  ['Красный Евгений Анатольевич', 'ETL Developer', 12],
  ['Кречко Анатолий Николаевич', '.NET Developer', 0],
  ['Крупская Яна Олеговна', 'QA Engineer', 2],
  ['Кудрей Екатерина Андреевна', 'UX/UI Designer', 4],
  ['Кунцов Юрий Олегович', 'Начальник отдела Frontend', 1],
  ['Купрейчик Виктор Евгеньевич', 'Java Developer', 0],
  ['Куприянов Денис Сергеевич', 'Frontend Developer', 1],
  ['Курачёв Алексей Николаевич', 'Pega Developer', 7],
  ['Лавренко Виталий Анатольевич', '.NET Developer', 0],
  ['Ладыженко Владимир Вячеславович', 'Начальник отдела BI Dev', 9],
  ['Лебедев Илья Вячеславович', 'Java Developer', 0],
  ['Лекторова Светлана Валентиновна', 'Начальник отдела IT Process', 10],
  ['Лешкович Ирина Анатольевна', 'Accountant', 14],
  ['Линник Михаил Алексеевич', 'Java Developer', 0],
  ['Лихачева Ксения Сергеевна', 'BI Analyst', 9],
  ['Лобанов Роман Валерьевич', 'Frontend Developer', 1],
  ['Лукьянов Даниил Денисович', 'Java Developer', 0],
  ['Любченко Наталья Николаевна', 'Pega Developer', 7],
  ['Макаревич Александр Валерьевич', 'CEO', 14],
  ['Максимов Константин Юрьевич', 'Monitoring Engineer', 11],
  ['Малиновский Дмитрий Юрьевич', 'DevOps Engineer', 5],
  ['Мацкевич Игорь Николаевич', 'Sales Manager', 14],
  ['Мелёхин Андрей Викторович', 'Equation Developer', 6],
  ['Мельников Николай Игоревич', 'Java Developer', 0],
  ['Мирончик Станислав Андреевич', '.NET Developer', 0],
  ['Мищенко Дмитрий Алексеевич', '.NET Developer', 0],
  ['Мозжухин Иван Александрович', 'COO', 14],
  ['Мороз Алеся Юрьевна', 'HR Specialist', 14],
  ['Морозов Вячеслав Николаевич', 'System Architect', 8],
  ['Мочалова Ольга Васильевна', 'English Teacher', 14],
  ['Мощин Евгений Вячеславович', 'Java Developer', 0],
  ['Мухин Леонид Сергеевич', 'Frontend Developer', 1],
  ['Невар Валерий Владимирович', 'Equation Developer', 6],
  ['Некрасова Светлана Борисовна', 'Business Analyst', 3],
  ['Некрашевич Павел Владимирович', 'Pega Developer', 7],
  ['Неправский Сергей Михайлович', 'Android Developer', 1],
  ['Нестеров Даниил Олегович', 'Ведущий инженер-программист', 0],
  ['Нестерович Роман Владимирович', 'Equation Developer', 6],
  ['Никитин Евгений Владимирович', 'Pega System Architect', 7],
  ['Новик Елена Павловна', 'Pega Developer', 7],
  ['Новиков Владимир Иосифович', '.NET Developer', 0],
  ['Новицкая Ксения Александровна', 'Business Analyst', 3],
  ['Новородская Виктория Борисовна', 'BI Analyst', 9],
  ['Ныркова Надежда Викторовна', 'QA Engineer', 2],
  ['Онуфриюк Вячеслав Петрович', 'System Architect', 8],
  ['Онуфриюк Сергей Сергеевич', 'ETL Developer', 12],
  ['Очеретянко Евгений Валентинович', 'Java Developer', 0],
  ['Павленко Анастасия Владимировна', 'Business Analyst', 3],
  ['Павлович Дмитрий Анатольевич', 'Developer Lead', 0],
  ['Павлють Виталий Вадимович', '.NET Developer', 0],
  ['Пайдре Анна Павловна', 'Office Manager', 14],
  ['Панасюк Елена Леонидовна', 'HR Specialist', 14],
  ['Пармон Игорь Олегович', 'Information Security Manager', 14],
  ['Пильтяй Александр Михайлович', 'DevOps Engineer', 5],
  ['Пименов Артём Дмитриевич', 'Java Developer', 0],
  ['Пирогов Владислав Витальевич', 'QA Automation Engineer', 2],
  ['Плетнёв Алексей Сергеевич', 'Frontend Developer', 1],
  ['Полозкова Инна Николаевна', 'Юрист', 14],
  ['Пономарева Мария Владимировна', 'Marketing Specialist', 14],
  ['Попова Анастасия Игоревна', 'Business Analyst', 3],
  ['Попова Мария Евгеньевна', 'ETL Developer', 12],
  ['Потапов Дмитрий Николаевич', 'Security Manager', 14],
  ['Пухнаревич Евгений Иосифович', 'Pega Developer', 7],
  ['Равинский Юрий Алексеевич', 'Начальник PMO', 13],
  ['Разоренов Михаил Алексеевич', 'Java Developer', 0],
  ['Ратникова Дарья Витальевна', 'QA Engineer', 2],
  ['Рожков Максим Фёдорович', 'Начальник отдела Equation', 6],
  ['Романова Ольга Игоревна', 'Pega Developer', 7],
  ['Романовский Пётр Иванович', '.NET Developer', 0],
  ['Рудаковский Фёдор Павлович', 'QA Engineer', 2],
  ['Рыбалтовский Алексей Дмитриевич', 'Java Developer', 0],
  ['Сабирова Юлия Евгеньевна', 'Business Analyst', 3],
  ['Савицкий Антон Юрьевич', '.NET Developer', 0],
  ['Саникович Александра Олеговна', 'Юрист', 14],
  ['Сафоненко Юрий Александрович', 'DevOps Engineer', 5],
  ['Сачковская Дарья Вадимовна', 'Frontend Developer', 1],
  ['Семёнов Алексей Андреевич', 'Java Developer', 0],
  ['Сергеюк Ирина Григорьевна', 'Бухгалтер', 14],
  ['Сидоров Максим Васильевич', 'BI Developer', 9],
  ['Скребнев Алексей Павлович', 'Monitoring Engineer', 11],
  ['Слободчиков Артём Александрович', 'Java Developer', 0],
  ['Смирнов Дмитрий Валерьевич', 'Equation Developer', 6],
  ['Стабровский Виктор Ленгинович', 'CTO / Начальник отдела Architecture', 8],
  ['Стасевич Никита Сергеевич', 'Frontend Developer', 1],
  ['Степанова Мария Андреевна', 'QA Engineer', 2],
  ['Стёпин Олег Иванович', 'Java Developer', 0],
  ['Стрельченко Дмитрий Иванович', 'Equation Developer', 6],
  ['Суботкевич Кирилл Александрович', 'Java Developer', 0],
  ['Сусаренко Максим Сергеевич', 'Sales Manager', 14],
  ['Сысоев Геннадий Николаевич', 'Помощник ГД', 14],
  ['Тарасевич Наталья Михайловна', 'ETL Developer', 12],
  ['Терещенко Егор Юрьевич', 'Инженер по охране труда', 14],
  ['Тимофеева Дина Романовна', 'QA Engineer', 2],
  ['Титов Дмитрий Валерьевич', 'Equation Developer', 6],
  ['Тозик Юлия Анатольевна', 'QA Engineer', 2],
  ['Тубалец Эвелина Витальевна', 'Java Developer', 0],
  ['Туз Екатерина Юрьевна', 'QA Automation Engineer', 2],
  ['Турский Алексей Николаевич', 'Lead .NET Developer', 0],
  ['Федотов Владислав Владимирович', 'Project Manager', 13],
  ['Филеня Татьяна Леонидовна', 'Ведущий специалист по персоналу', 14],
  ['Филимончик Анна Дмитриевна', 'Java Developer', 0],
  ['Филипович Светлана Александровна', 'Technical Writer', 3],
  ['Филиппов Никита Юрьевич', 'ML Engineer', 9],
  ['Филон Иван Юрьевич', 'Java Developer', 0],
  ['Хайдаров Евгений Юсубжонович', 'Business Analyst', 3],
  ['Хамицаева Софья Маратовна', 'Java Developer', 0],
  ['Хмарский Сергей Иванович', 'Monitoring System Engineer', 11],
  ['Хмыль Даниил Александрович', '.NET Developer', 0],
  ['Храпская Александра Александровна', 'Инженер-программист', 0],
  ['Христофоров Александр Ильич', 'Business Analyst', 3],
  ['Худик Евгений Александрович', 'Solution Architect', 8],
  ['Целиков Александр Александрович', 'Java Developer', 0],
  ['Церех Ольга Константиновна', 'Business Analyst', 3],
  ['Чугай Виктор Иванович', 'System Architect', 8],
  ['Чуносова Екатерина Андреевна', 'Business Analyst', 3],
  ['Шаблинская Алина Вадимовна', 'Frontend Developer', 1],
  ['Шевцов Евгений Сергеевич', 'Java Developer', 0],
  ['Шимкович Валентин Александрович', '.NET Developer', 0],
  ['Шиянов Никита Сергеевич', 'Pega Developer', 7],
  ['Шуляк Ольга Ивановна', 'Бухгалтер', 14],
  ['Щербакова Елизавета Романовна', 'QA Engineer', 2],
  ['Юрченко Андрей Николаевич', 'Frontend Developer', 1],
  ['Яковенко Екатерина Андреевна', 'HR Specialist', 14],
  ['Яроцкий Ярослав Юрьевич', 'DevOps Engineer', 5],
  ['Яцкевич Дмитрий Павлович', 'Java Developer', 0],
  // Additional employees to reach 320+
  ['Кондратенко Игорь Сергеевич', 'Java Developer', 0],
  ['Петрова Алина Дмитриевна', 'QA Engineer', 2],
  ['Сорокин Виталий Андреевич', '.NET Developer', 0],
  ['Коваленко Марина Игоревна', 'Business Analyst', 3],
  ['Дроздов Павел Николаевич', 'Frontend Developer', 1],
  ['Миронова Елена Сергеевна', 'Pega Developer', 7],
  ['Карпович Максим Олегович', 'Equation Developer', 6],
  ['Литвинова Анна Павловна', 'QA Automation Engineer', 2],
  ['Волков Артём Игоревич', 'DevOps Engineer', 5],
  ['Соколова Ирина Викторовна', 'BI Analyst', 9],
  ['Климов Дмитрий Алексеевич', 'ETL Developer', 12],
  ['Борисова Наталья Юрьевна', 'Business Analyst', 3],
  ['Кузнецов Андрей Михайлович', 'Java Developer', 0],
  ['Фёдорова Ольга Андреевна', 'Project Manager', 13],
  ['Гришин Сергей Петрович', 'System Architect', 8],
  ['Иванова Дарья Олеговна', 'UX/UI Designer', 4],
  ['Орлов Никита Валерьевич', 'Frontend Developer', 1],
  ['Белова Анастасия Дмитриевна', 'QA Engineer', 2],
  ['Тихонов Алексей Сергеевич', 'Monitoring Engineer', 11],
  ['Крылова Виктория Александровна', 'Business Analyst', 3],
  ['Зайцев Роман Игоревич', '.NET Developer', 0],
  ['Михайлова Юлия Валерьевна', 'Pega Developer', 7],
  ['Егоров Владислав Олегович', 'Java Developer', 0],
  ['Лебедева Ксения Андреевна', 'QA Engineer', 2],
  ['Попов Даниил Сергеевич', 'Equation Developer', 6],
  ['Никольская Мария Дмитриевна', 'Business Analyst', 3],
  ['Комаров Илья Павлович', 'Frontend Developer', 1],
  ['Харитонова Екатерина Игоревна', 'BI Developer', 9],
  ['Макаров Пётр Валерьевич', 'DevOps Engineer', 5],
  ['Власова Алина Сергеевна', 'HR Specialist', 14],
];

// ── Skill pools per department for realistic assignment ──
const DEPT_SKILLS = {
  0: ['Java', 'Spring Boot', 'Hibernate', '.NET', 'C#', 'PostgreSQL', 'Oracle', 'MSSQL', 'Redis', 'Kafka', 'Docker', 'Microservices', 'REST', 'gRPC', 'DDD', 'Clean Architecture', 'MongoDB'],
  1: ['JavaScript', 'TypeScript', 'React', 'Angular', 'Vue', 'Node.js', 'REST', 'GraphQL', 'Docker', 'Swift', 'Kotlin', 'Figma'],
  2: ['Selenium', 'Postman', 'TestRail', 'JMeter', 'Jira', 'PostgreSQL', 'REST', 'Docker'],
  3: ['Draw.io', 'Miro', 'BPMN', 'Jira', 'Confluence', 'Figma', 'PostgreSQL'],
  4: ['Figma', 'Sketch', 'Adobe XD', 'Miro', 'Draw.io'],
  5: ['Docker', 'Kubernetes', 'Terraform', 'Ansible', 'Jenkins', 'GitLab CI', 'AWS', 'Azure', 'Zabbix', 'Grafana', 'ELK', 'Prometheus'],
  6: ['Equation', 'COBOL', 'Oracle', 'PostgreSQL'],
  7: ['Pega', 'BPMN', 'Camunda', 'Java', 'Oracle', 'REST'],
  8: ['Microservices', 'DDD', 'Clean Architecture', 'Docker', 'Kubernetes', 'Java', '.NET', 'PostgreSQL', 'Oracle', 'Kafka', 'REST', 'gRPC'],
  9: ['Power BI', 'Tableau', 'QlikView', 'PostgreSQL', 'Oracle', 'Python', 'Informatica', 'ETL'],
  10: ['SMAX', 'ITIL', 'ITSM', 'Draw.io', 'Miro', 'BPMN', 'Jira', 'Confluence'],
  11: ['Zabbix', 'Grafana', 'ELK', 'Prometheus', 'Docker', 'Python'],
  12: ['Informatica', 'Talend', 'ETL', 'Oracle', 'PostgreSQL', 'Python'],
  13: ['Jira', 'Confluence', 'Miro', 'Agile', 'Scrum', 'SAFe'],
  14: ['Jira', 'Confluence', 'Miro'],
};

// ── Project pools per department ──
const DEPT_PROJECTS = {
  0: ['proj-1', 'proj-4', 'proj-6', 'proj-9', 'proj-12'],
  1: ['proj-1', 'proj-4', 'proj-5', 'proj-9', 'proj-11'],
  2: ['proj-1', 'proj-4', 'proj-5', 'proj-6', 'proj-7', 'proj-9', 'proj-12'],
  3: ['proj-1', 'proj-2', 'proj-3', 'proj-5', 'proj-7', 'proj-9', 'proj-12'],
  4: ['proj-1', 'proj-5', 'proj-9', 'proj-11'],
  5: ['proj-4', 'proj-8', 'proj-10'],
  6: ['proj-6'],
  7: ['proj-7', 'proj-12'],
  8: ['proj-1', 'proj-4', 'proj-6', 'proj-9'],
  9: ['proj-2', 'proj-3'],
  10: ['proj-8'],
  11: ['proj-8'],
  12: ['proj-2', 'proj-3'],
  13: ['proj-1', 'proj-2', 'proj-5', 'proj-6', 'proj-7', 'proj-9', 'proj-12'],
  14: [],
};

// Deterministic pseudo-random based on seed
function seededRandom(seed) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function pick(arr, rng) {
  return arr[Math.floor(rng() * arr.length)];
}

function pickN(arr, min, max, rng) {
  const count = min + Math.floor(rng() * (max - min + 1));
  const shuffled = [...arr].sort(() => rng() - 0.5);
  return shuffled.slice(0, count);
}

function generateEmployees() {
  const employees = [];
  const rng = seededRandom(42);

  for (let i = 0; i < RAW_EMPLOYEES.length; i++) {
    const [name, role, deptIdx] = RAW_EMPLOYEES[i];
    const team = TEAMS[deptIdx];

    // Skills: 3–6 per person from department pool + some cross-skills
    const deptSkills = DEPT_SKILLS[deptIdx] || DEPT_SKILLS[14];
    const skillNames = pickN(deptSkills, Math.min(3, deptSkills.length), Math.min(6, deptSkills.length), rng);
    const skills = skillNames.map((s) => ({
      name: s,
      level: pick(LEVELS, rng),
    }));

    // Projects: 1–2 per person from department pool
    const deptProjs = DEPT_PROJECTS[deptIdx] || [];
    const projectCount = deptProjs.length === 0 ? 0 : 1 + Math.floor(rng() * Math.min(2, deptProjs.length));
    const assignedProjectIds = pickN(deptProjs, projectCount, projectCount, rng);
    const assignedProjects = assignedProjectIds.map(id => PROJECTS.find(p => p.id === id)).filter(Boolean);

    // Spread allocation
    let remaining = deptIdx === 14 ? 0 : 100;
    const allocations = assignedProjects.map((p, idx) => {
      const isLast = idx === assignedProjects.length - 1;
      const pct = isLast
        ? remaining
        : Math.min(remaining, 30 + Math.floor(rng() * 40));
      remaining -= pct;

      const startDay = 1 + Math.floor(rng() * 10);
      const endMonth = 2 + Math.floor(rng() * 2);
      const endDay = 10 + Math.floor(rng() * 18);
      return {
        projectId: p.id,
        projectName: p.name,
        role: pick(['Developer', 'Lead', 'Reviewer', 'Analyst'], rng),
        startDate: `2026-01-${String(startDay).padStart(2, '0')}`,
        endDate: `2026-${String(endMonth).padStart(2, '0')}-${String(endDay).padStart(2, '0')}`,
        percentage: pct,
      };
    });

    const totalAllocation = allocations.reduce((s, a) => s + a.percentage, 0);

    // Status
    let status;
    if (rng() < 0.07) {
      status = 'Vacation';
    } else if (totalAllocation === 0) {
      status = 'Bench';
    } else if (totalAllocation < 80) {
      status = 'Partial';
    } else {
      status = 'Available';
    }

    // Vacation windows
    const vacation = [];
    if (status === 'Vacation' || rng() < 0.18) {
      const vStart = 5 + Math.floor(rng() * 20);
      const vMonth = 1 + Math.floor(rng() * 3);
      vacation.push({
        startDate: `2026-${String(vMonth).padStart(2, '0')}-${String(vStart).padStart(2, '0')}`,
        endDate: `2026-${String(vMonth).padStart(2, '0')}-${String(Math.min(28, vStart + 5 + Math.floor(rng() * 10))).padStart(2, '0')}`,
      });
    }

    const achievements = pickN(ACHIEVEMENT_POOL, 0, 4, rng);
    const certificates = Math.floor(rng() * 5);
    const completionScore = 50 + Math.floor(rng() * 51);

    employees.push({
      id: `emp-${i + 1}`,
      name,
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}&backgroundColor=e2e8f0&textColor=334155`,
      role,
      team,
      skills,
      projects: assignedProjects.map((p) => p.id),
      allocations,
      totalAllocation,
      status,
      vacation,
      achievements,
      certificates,
      completionScore,
    });
  }

  return employees;
}

export const projects = PROJECTS;
export const teams = TEAMS;
export const allSkills = SKILLS_POOL;
export const employees = generateEmployees();
