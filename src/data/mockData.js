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
  ['Борщёв Каролина Евгеньевна', 'Специалист по персоналу', 14],
  ['Пельменев Ксения Анриевна', 'Marketing Specialist', 14],
  ['Котлетов Геннадий Александрович', '.NET Developer', 0],
  ['Блинчиков Александр Анатольевич', 'Руководитель проекта', 13],
  ['Шашлыков Евгений Константинович', 'Project Manager', 13],
  ['Компотов Наталия Леонидовна', 'Business Analyst', 3],
  ['Самоваров Дарин Аделевна', 'Lead Generation Manager', 14],
  ['Пирожков Екатерина Григорьевна', 'Начальник финансового отдела', 14],
  ['Сырников Дмитрий Александрович', 'Business Analyst', 3],
  ['Тефтелев Анна Владимировна', 'Руководитель проекта', 13],
  ['Оладушкин Мария Геннадьевна', 'QA Engineer', 2],
  ['Вареников Марина Ивановна', 'QA Pega', 2],
  ['Бубликов Иван Викторович', 'Ведущий инженер-программист', 0],
  ['Ватрушкин Максим Сергеевич', 'Agile Coordinator', 14],
  ['Плюшкин Святослав Дмитриевич', 'Equation Developer', 6],
  ['Калачёв Алексей Маратович', 'Ведущий инженер-программист', 8],
  ['Кефирчиков Павел Александрович', 'Начальник отдела дизайна', 4],
  ['Сметанкин Алексей Константинович', 'System Analyst', 10],
  ['Творожков Илья Сергеевич', 'iOS Developer', 1],
  ['Кашеваров Олег Борисович', 'System Architect', 8],
  ['Крендельков Виталий Геннадьевич', 'Специалист по компьютерной графике', 4],
  ['Пончиков Сергей Анатольевич', 'Project Manager', 13],
  ['Сушкин Иван Глебович', 'Business Analyst', 3],
  ['Баранков Ольга Викторовна', 'Начальник отдела QA', 2],
  ['Тормозов Екатерина Вячеславовна', 'Business Analyst', 10],
  ['Шуруповёртов Наталия Валерьевна', 'Technical Writer', 3],
  ['Гаечкин Елена Евгеньевна', 'UX/UI Designer', 4],
  ['Болтиков Юлия Фёдоровна', 'Java Developer', 0],
  ['Кнопкин Светлана Викторовна', 'Business Analyst', 3],
  ['Мышкин Ярослав Дмитриевич', 'Sales Manager', 14],
  ['Клавишников Анна Андреевна', 'Project Manager', 13],
  ['Монитóров Александр Васильевич', '.NET Developer', 0],
  ['Флешкин Денис Игоревич', 'Lead Java Developer', 0],
  ['Процессоров Екатерина Александровна', 'Business Analyst', 3],
  ['Пикселев Андрей Юрьевич', 'Agile Coach', 14],
  ['Драйверов Дмитрий Владимирович', 'Project Manager', 13],
  ['Серверов Дмитрий Геннадьевич', 'Начальник отдела мониторинга', 11],
  ['Роутеров Елена Анатольевна', 'Business Analyst', 3],
  ['Баговский Александр Владимирович', 'Начальник отдела BI', 9],
  ['Дебагов Маргарита Александровна', 'Project Manager', 13],
  ['Крокодилов Екатерина Александровна', 'Business Analyst', 3],
  ['Бегемотов Сергей Павлович', 'Начальник отдела Backend', 0],
  ['Пингвинов Кирилл Андреевич', 'Java Developer', 0],
  ['Медведков Надежда Николаевна', 'Business Analyst', 3],
  ['Хомяков Александр Андреевич', 'Head of Delivery / DevOps Lead', 5],
  ['Барсуков Ольга Олеговна', 'QA Engineer', 2],
  ['Енотов Анастасия Дмитриевна', 'QA Engineer', 2],
  ['Бобриков Антон Андреевич', 'Java Developer', 0],
  ['Сусликов Андрей Игоревич', 'DevOps Engineer', 5],
  ['Попугаев Сергей Анатольевич', '.NET Developer', 0],
  ['Дятлов Виталий Станиславович', 'Equation Developer', 6],
  ['Кукушкин Илья Сергеевич', 'Java Developer', 0],
  ['Снегирёв Артём Андреевич', 'Frontend Developer', 1],
  ['Воробушкин Анастасия Валерьевна', 'QA Engineer', 2],
  ['Синичкин Виктория Олеговна', 'QA Engineer', 2],
  ['Жирафов Кирилл Денисович', 'Equation Developer', 6],
  ['Ракетов Александр Евгеньевич', 'Pega System Architect', 7],
  ['Космосов Юлия Михайловна', 'HR Director', 14],
  ['Луноходов Кирилл Евгеньевич', 'Sales Manager', 14],
  ['Спутников Алексей Иванович', 'Java Developer', 0],
  ['Астероидов Илья Кириллович', 'Frontend Developer', 1],
  ['Комётов Наталья Александровна', 'QA Engineer', 2],
  ['Звездочётов Павел Олегович', 'Java Developer', 0],
  ['Телескопов Виктория Сергеевна', 'QA Engineer', 2],
  ['Молоточкин Пётр Иванович', 'ETL Developer', 12],
  ['Кувалдин Степан Михайлович', 'Java Developer', 0],
  ['Гвоздиков Олеся Олеговна', 'Бухгалтер', 14],
  ['Напильников Артемий Николаевич', '.NET Developer', 0],
  ['Пилочкин Наталия Дмитриевна', 'Business Analyst', 3],
  ['Рубанков Юлия Дмитриевна', 'QA Engineer', 2],
  ['Стамесков Антон Юрьевич', 'BI Developer', 9],
  ['Лопаткин Александр Витальевич', 'Equation Developer', 6],
  ['Грабельков Дмитрий Васильевич', 'BI Analyst', 9],
  ['Тяпочкин Марина Михайловна', 'Java Developer', 0],
  ['Лейкин Андрей Дмитриевич', 'Equation Developer', 6],
  ['Ведёрков Мария Юрьевна', '.NET Developer', 0],
  ['Черпаков Вероника Валерьевна', 'Начальник отдела BA', 3],
  ['Кастрюлькин Виолетта Игоревна', 'Business Analyst Intern', 3],
  ['Сковородкин Никита Сергеевич', 'Java Developer', 0],
  ['Половников Максим Дмитриевич', '.NET Developer', 0],
  ['Бананов Юрий Евгеньевич', 'Frontend Developer', 1],
  ['Арбузов Павел Александрович', 'BI Analyst', 9],
  ['Апельсинов Наталья Викторовна', 'Pega Developer', 7],
  ['Мандаринов Виктор Анатольевич', 'Database Administrator', 5],
  ['Ананасов Юрий Николаевич', 'Equation Developer', 6],
  ['Персиков Марина Владимировна', 'Business Analyst', 3],
  ['Абрикосов Владислав Владимирович', 'Lead .NET Developer', 0],
  ['Виноградов Валентина Александровна', 'Business Analyst', 3],
  ['Клубничкин Никита Валерьевич', 'Ведущий инженер-программист', 0],
  ['Малинкин Алексей Андреевич', 'Equation Developer', 6],
  ['Ежевичкин Даянч Миргельдыевич', 'Pega Developer', 7],
  ['Черничкин Андрей Сергеевич', 'Business Analyst', 3],
  ['Смородинов Сергей Викторович', 'Risk Manager', 14],
  ['Крыжовников Ирина Викторовна', 'Business Analyst', 3],
  ['Грушкин Ирина Валерьевна', 'Начальник отдела Pega', 7],
  ['Яблочков Сергей Викторович', 'Business Analyst', 3],
  ['Подушкин Владислав Юрьевич', 'Equation Developer', 6],
  ['Одеялков Александр Олегович', 'Frontend Developer', 1],
  ['Матрасов Кристина Леонидовна', 'QA Engineer', 2],
  ['Кроваткин Илья Олегович', 'Equation Developer', 6],
  ['Диванов Кристина Сергеевна', 'QA Engineer', 2],
  ['Пуфиков Виктория Александровна', 'Business Analyst', 3],
  ['Табуреткин Александр Олегович', 'Зам. ГД по архитектуре ПО', 8],
  ['Шкафов Виталий Игоревич', 'Java Developer', 0],
  ['Торшеров Антон Николаевич', 'Pega Developer', 7],
  ['Люстров Евгений Александрович', 'System Architect', 8],
  ['Занавесков Владимир Владимирович', 'Monitoring Engineer', 11],
  ['Ковриков Надежда Андреевна', 'Project Manager', 13],
  ['Тапочкин Ирина Витальевна', 'QA Engineer', 2],
  ['Носочкин Елена Александровна', 'Business Analyst', 3],
  ['Шапочкин Никита Геннадьевич', 'Java Developer', 0],
  ['Варежкин Евгений Анатольевич', 'ETL Developer', 12],
  ['Зонтиков Анатолий Николаевич', '.NET Developer', 0],
  ['Шарфиков Яна Олеговна', 'QA Engineer', 2],
  ['Перчаткин Екатерина Андреевна', 'UX/UI Designer', 4],
  ['Ботинков Юрий Олегович', 'Начальник отдела Frontend', 1],
  ['Сапожков Виктор Евгеньевич', 'Java Developer', 0],
  ['Кроссовкин Денис Сергеевич', 'Frontend Developer', 1],
  ['Кедиков Алексей Николаевич', 'Pega Developer', 7],
  ['Тапков Виталий Анатольевич', '.NET Developer', 0],
  ['Чайников Владимир Вячеславович', 'Начальник отдела BI Dev', 9],
  ['Кофейников Илья Вячеславович', 'Java Developer', 0],
  ['Стаканов Светлана Валентиновна', 'Начальник отдела IT Process', 10],
  ['Бокальчиков Ирина Анатольевна', 'Accountant', 14],
  ['Кружкин Михаил Алексеевич', 'Java Developer', 0],
  ['Тарелкин Ксения Сергеевна', 'BI Analyst', 9],
  ['Вилочкин Роман Валерьевич', 'Frontend Developer', 1],
  ['Ложкин Даниил Денисович', 'Java Developer', 0],
  ['Солонков Наталья Николаевна', 'Pega Developer', 7],
  ['Перечников Александр Валерьевич', 'CEO', 14],
  ['Маслёнков Константин Юрьевич', 'Monitoring Engineer', 11],
  ['Хлебушкин Дмитрий Юрьевич', 'DevOps Engineer', 5],
  ['Батонов Игорь Николаевич', 'Sales Manager', 14],
  ['Рогаликов Андрей Викторович', 'Equation Developer', 6],
  ['Круассанов Николай Игоревич', 'Java Developer', 0],
  ['Тостеров Станислав Андреевич', '.NET Developer', 0],
  ['Огурцов Дмитрий Алексеевич', '.NET Developer', 0],
  ['Помидоров Иван Александрович', 'COO', 14],
  ['Морковкин Алеся Юрьевна', 'HR Specialist', 14],
  ['Капусткин Вячеслав Николаевич', 'System Architect', 8],
  ['Свёклин Ольга Васильевна', 'English Teacher', 14],
  ['Картошкин Евгений Вячеславович', 'Java Developer', 0],
  ['Редиськин Леонид Сергеевич', 'Frontend Developer', 1],
  ['Лучков Валерий Владимирович', 'Equation Developer', 6],
  ['Чесночков Светлана Борисовна', 'Business Analyst', 3],
  ['Петрушкин Павел Владимирович', 'Pega Developer', 7],
  ['Укропов Сергей Михайлович', 'Android Developer', 1],
  ['Базиликов Даниил Олегович', 'Ведущий инженер-программист', 0],
  ['Кинзарёв Роман Владимирович', 'Equation Developer', 6],
  ['Мятликов Евгений Владимирович', 'Pega System Architect', 7],
  ['Розмаринов Елена Павловна', 'Pega Developer', 7],
  ['Тимьянов Владимир Иосифович', '.NET Developer', 0],
  ['Парашютов Ксения Александровна', 'Business Analyst', 3],
  ['Планёров Виктория Борисовна', 'BI Analyst', 9],
  ['Дельтаплáнов Надежда Викторовна', 'QA Engineer', 2],
  ['Воздушкин Вячеслав Петрович', 'System Architect', 8],
  ['Облачков Сергей Сергеевич', 'ETL Developer', 12],
  ['Тучкин Евгений Валентинович', 'Java Developer', 0],
  ['Дождиков Анастасия Владимировна', 'Business Analyst', 3],
  ['Снежков Дмитрий Анатольевич', 'Developer Lead', 0],
  ['Градинкин Виталий Вадимович', '.NET Developer', 0],
  ['Ветерков Анна Павловна', 'Office Manager', 14],
  ['Бризов Елена Леонидовна', 'HR Specialist', 14],
  ['Штормов Игорь Олегович', 'Information Security Manager', 14],
  ['Молниев Александр Михайлович', 'DevOps Engineer', 5],
  ['Громов Артём Дмитриевич', 'Java Developer', 0],
  ['Радугов Владислав Витальевич', 'QA Automation Engineer', 2],
  ['Закатов Алексей Сергеевич', 'Frontend Developer', 1],
  ['Рассветов Инна Николаевна', 'Юрист', 14],
  ['Полуночкин Мария Владимировна', 'Marketing Specialist', 14],
  ['Сумерков Анастасия Игоревна', 'Business Analyst', 3],
  ['Зарёв Мария Евгеньевна', 'ETL Developer', 12],
  ['Луннов Дмитрий Николаевич', 'Security Manager', 14],
  ['Звёздкин Евгений Иосифович', 'Pega Developer', 7],
  ['Затмёнков Юрий Алексеевич', 'Начальник PMO', 13],
  ['Сиянников Михаил Алексеевич', 'Java Developer', 0],
  ['Пузырёв Дарья Витальевна', 'QA Engineer', 2],
  ['Шарикин Максим Фёдорович', 'Начальник отдела Equation', 6],
  ['Фонтанов Ольга Игоревна', 'Pega Developer', 7],
  ['Каруселёв Пётр Иванович', '.NET Developer', 0],
  ['Качелькин Фёдор Павлович', 'QA Engineer', 2],
  ['Горочкин Алексей Дмитриевич', 'Java Developer', 0],
  ['Песочников Юлия Евгеньевна', 'Business Analyst', 3],
  ['Куличиков Антон Юрьевич', '.NET Developer', 0],
  ['Скамеечкин Александра Олеговна', 'Юрист', 14],
  ['Лавочкин Юрий Александрович', 'DevOps Engineer', 5],
  ['Фонариков Дарья Вадимовна', 'Frontend Developer', 1],
  ['Столбиков Алексей Андреевич', 'Java Developer', 0],
  ['Заборчиков Ирина Григорьевна', 'Бухгалтер', 14],
  ['Калиточкин Максим Васильевич', 'BI Developer', 9],
  ['Мостиков Алексей Павлович', 'Monitoring Engineer', 11],
  ['Тропинкин Артём Александрович', 'Java Developer', 0],
  ['Полянкин Дмитрий Валерьевич', 'Equation Developer', 6],
  ['Лужайкин Виктор Ленгинович', 'CTO / Начальник отдела Architecture', 8],
  ['Клумбочкин Никита Сергеевич', 'Frontend Developer', 1],
  ['Грядочкин Мария Андреевна', 'QA Engineer', 2],
  ['Теплицкин Олег Иванович', 'Java Developer', 0],
  ['Беседочкин Дмитрий Иванович', 'Equation Developer', 6],
  ['Гамачкин Кирилл Александрович', 'Java Developer', 0],
  ['Мангалов Максим Сергеевич', 'Sales Manager', 14],
  ['Кактусов Геннадий Николаевич', 'Помощник ГД', 14],
  ['Фикусов Наталья Михайловна', 'ETL Developer', 12],
  ['Ромашкин Егор Юрьевич', 'Инженер по охране труда', 14],
  ['Тюльпанов Дина Романовна', 'QA Engineer', 2],
  ['Василёчкин Дмитрий Валерьевич', 'Equation Developer', 6],
  ['Одуванчиков Юлия Анатольевна', 'QA Engineer', 2],
  ['Ландышев Эвелина Витальевна', 'Java Developer', 0],
  ['Подснежников Екатерина Юрьевна', 'QA Automation Engineer', 2],
  ['Барабанов Алексей Николаевич', 'Lead .NET Developer', 0],
  ['Гитаркин Владислав Владимирович', 'Project Manager', 13],
  ['Скрипочкин Татьяна Леонидовна', 'Ведущий специалист по персоналу', 14],
  ['Трубачёв Анна Дмитриевна', 'Java Developer', 0],
  ['Бубенчиков Светлана Александровна', 'Technical Writer', 3],
  ['Колокольчиков Никита Юрьевич', 'ML Engineer', 9],
  ['Маракасов Иван Юрьевич', 'Java Developer', 0],
  ['Баяников Евгений Юсубжонович', 'Business Analyst', 3],
  ['Штанишкин Софья Маратовна', 'Java Developer', 0],
  ['Пиджачков Сергей Иванович', 'Monitoring System Engineer', 11],
  ['Галстучкин Даниил Александрович', '.NET Developer', 0],
  ['Рубашкин Александра Александровна', 'Инженер-программист', 0],
  ['Жилеточкин Александр Ильич', 'Business Analyst', 3],
  ['Свитерков Евгений Александрович', 'Solution Architect', 8],
  ['Толстовкин Александр Александрович', 'Java Developer', 0],
  ['Курточкин Ольга Константиновна', 'Business Analyst', 3],
  ['Макаронов Виктор Иванович', 'System Architect', 8],
  ['Спагеттин Екатерина Андреевна', 'Business Analyst', 3],
  ['Лазаньев Алина Вадимовна', 'Frontend Developer', 1],
  ['Пиццериков Евгений Сергеевич', 'Java Developer', 0],
  ['Равиолин Валентин Александрович', '.NET Developer', 0],
  ['Ньоккин Никита Сергеевич', 'Pega Developer', 7],
  ['Тортеллинов Ольга Ивановна', 'Бухгалтер', 14],
  ['Фетучинников Елизавета Романовна', 'QA Engineer', 2],
  ['Бисквитов Андрей Николаевич', 'Frontend Developer', 1],
  ['Эклеров Екатерина Андреевна', 'HR Specialist', 14],
  ['Профитрольев Ярослав Юрьевич', 'DevOps Engineer', 5],
  ['Зефиркин Дмитрий Павлович', 'Java Developer', 0],
  // Additional employees to reach 320+
  ['Мармеладов Игорь Сергеевич', 'Java Developer', 0],
  ['Карамельков Алина Дмитриевна', 'QA Engineer', 2],
  ['Ирисков Виталий Андреевич', '.NET Developer', 0],
  ['Нугатов Марина Игоревна', 'Business Analyst', 3],
  ['Трюфелёв Павел Николаевич', 'Frontend Developer', 1],
  ['Маффинов Елена Сергеевна', 'Pega Developer', 7],
  ['Капкейкин Максим Олегович', 'Equation Developer', 6],
  ['Тирамисуев Анна Павловна', 'QA Automation Engineer', 2],
  ['Панакотов Артём Игоревич', 'DevOps Engineer', 5],
  ['Крембрюлёв Ирина Викторовна', 'BI Analyst', 9],
  ['Суфлёв Дмитрий Алексеевич', 'ETL Developer', 12],
  ['Безёв Наталья Юрьевна', 'Business Analyst', 3],
  ['Чизкейков Андрей Михайлович', 'Java Developer', 0],
  ['Штруделев Ольга Андреевна', 'Project Manager', 13],
  ['Вафелькин Сергей Петрович', 'System Architect', 8],
  ['Крепов Дарья Олеговна', 'UX/UI Designer', 4],
  ['Маршмелков Никита Валерьевич', 'Frontend Developer', 1],
  ['Драже́в Анастасия Дмитриевна', 'QA Engineer', 2],
  ['Щербетов Алексей Сергеевич', 'Monitoring Engineer', 11],
  ['Халвинкин Виктория Александровна', 'Business Analyst', 3],
  ['Лимонадов Роман Игоревич', '.NET Developer', 0],
  ['Коктейлев Юлия Валерьевна', 'Pega Developer', 7],
  ['Смузиков Владислав Олегович', 'Java Developer', 0],
  ['Фрешкин Ксения Андреевна', 'QA Engineer', 2],
  ['Молочков Даниил Сергеевич', 'Equation Developer', 6],
  ['Кисельков Мария Дмитриевна', 'Business Analyst', 3],
  ['Морсиков Илья Павлович', 'Frontend Developer', 1],
  ['Квасников Екатерина Игоревна', 'BI Developer', 9],
  ['Борщёв Пётр Валерьевич', 'DevOps Engineer', 5],
  ['Пельменев Алина Сергеевна', 'HR Specialist', 14],
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
