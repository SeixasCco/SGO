export const expenseFormMap = {

    // --- GRUPO: VEÍCULOS ---
    "c1b7c9b0-1000-4000-8000-000000000002": [ // Combustível
        { name: 'municipioUf', label: 'Município/UF', type: 'text', placeholder: 'Ex: Chapecó/SC' },
        { name: 'placaVeiculo', label: 'Placa do Veículo', type: 'text', placeholder: 'Ex: ABC-1234' },
        { name: 'kmVeiculo', label: 'KM do Veículo', type: 'number', placeholder: 'Ex: 150000' },
        { name: 'funcionario', label: 'Funcionário', type: 'text', placeholder: 'Nome do funcionário' },
    ],
    "c1b7c9b0-1000-4000-8000-000000000005": [ /* Diesel - usa a mesma estrutura de Combustível */ ],
    "c1b7c9b0-1000-4000-8000-000000000021": [ // Pedágios
        { name: 'municipioUf', label: 'Município/UF', type: 'text', placeholder: 'Ex: Chapecó/SC' },
        { name: 'placaVeiculo', label: 'Placa do Veículo', type: 'text', placeholder: 'Ex: ABC-1234' },
    ],
    "c1b7c9b0-1000-4000-8000-000000000028": [ // Veículos (multas, licenciamentos, taxas)
        { name: 'municipioUf', label: 'Município/UF', type: 'text', placeholder: 'Ex: Chapecó/SC' },
        { name: 'placaVeiculo', label: 'Placa do Veículo', type: 'text', placeholder: 'Ex: ABC-1234' },
        { name: 'indicacaoCondutor', label: 'Indicação do Condutor', type: 'text', placeholder: 'Nome do condutor' },
    ],

    // --- GRUPO: FORNECEDORES (com NF) ---
    "c1b7c9b0-1000-4000-8000-000000000009": [ // Ferramentas/ ferragens
        { name: 'razaoSocial', label: 'Razão Social', type: 'text', placeholder: 'Nome do fornecedor' },
        { name: 'nrNf', label: 'Número da NF', type: 'text', placeholder: 'Ex: 98765' },
        { name: 'cnpj', label: 'CNPJ', type: 'text', placeholder: '00.000.000/0000-00' },
        { name: 'municipioUf', label: 'Município/UF', type: 'text', placeholder: 'Ex: Chapecó/SC' },
    ],
    "c1b7c9b0-1000-4000-8000-000000000006": [ /* EPI's e uniformes */ ],
    "c1b7c9b0-1000-4000-8000-000000000017": [ /* Locação de Munck/ Guindaste */ ],
    "c1b7c9b0-1000-4000-8000-000000000016": [ /* Locação de PTA */ ],
    "c1b7c9b0-1000-4000-8000-000000000015": [ /* Locação de Container */ ],
    "c1b7c9b0-1000-4000-8000-000000000012": [ /* Honorários de contabilidade */ ],
    "c1b7c9b0-1000-4000-8000-000000000011": [ /* Honorários administrativos */ ],
    "c1b7c9b0-1000-4000-8000-000000000013": [ /* Honorários jurídicos */ ],
    "c1b7c9b0-1000-4000-8000-000000000026": [ /* Serviços de Engenharia (ART, Projetos) */ ],
    "c1b7c9b0-1000-4000-8000-000000000022": [ /* Serviços de treinamento */ ],
    "c1b7c9b0-1000-4000-8000-000000000018": [ /* Mecânica e manutenções */ ],
    "c1b7c9b0-1000-4000-8000-000000000014": [ /* Hospedagens */ ],
    "c1b7c9b0-1000-4000-8000-000000000007": [ /* Exames e Clínicas */ ],
    "c1b7c9b0-1000-4000-8000-000000000008": [ /* Farmácia e medicamentos */ ],

    // --- GRUPO: FOLHAS DE PAGAMENTO ---
    "c1b7c9b0-1000-4000-8000-000000000010": [ // Folhas de pagamento
        { name: 'competencia', label: 'Competência', type: 'text', placeholder: 'MM/AAAA' },
        { name: 'funcionario', label: 'Funcionário', type: 'text', placeholder: 'Nome do funcionário' },
        { name: 'nrOrdem', label: 'Nº Ordem', type: 'text', placeholder: 'Número da ordem' },
    ],
    "c1b7c9b0-1000-4000-8000-000000000024": [ /* Folhas de Adiantamento Salarial */ ],
    "c1b7c9b0-1000-4000-8000-000000000025": [ /* Folhas de férias */ ],
    "c1b7c9b0-1000-4000-8000-000000000023": [ /* Folhas de 13º */ ],
    "c1b7c9b0-1000-4000-8000-000000000029": [ // Verbas rescisórias
        { name: 'competencia', label: 'Competência', type: 'text', placeholder: 'MM/AAAA' },
        { name: 'funcionario', label: 'Funcionário', type: 'text', placeholder: 'Nome do funcionário' },
        { name: 'dataAfastamento', label: 'Data de Afastamento', type: 'date' },
        { name: 'dataPagamento', label: 'Data do Pagamento', type: 'date' },
        { name: 'nrOrdem', label: 'Nº Ordem', type: 'text', placeholder: 'Número da ordem' },
    ],
    
    // --- GRUPO: TRIBUTOS ---
    "c1b7c9b0-1000-4000-8000-000000000027": [
        { name: 'competencia', label: 'Competência', type: 'text', placeholder: 'MM/AAAA' },
        { name: 'vencimento', label: 'Vencimento', type: 'date' },
    ],
    
    // --- GRUPO: GERAL (CAMPOS MÍNIMOS) ---
    "c1b7c9b0-1000-4000-8000-000000000001": [ // Alimentação/ mercado
        { name: 'municipioUf', label: 'Município/UF', type: 'text', placeholder: 'Ex: Chapecó/SC' },
    ],
    "c1b7c9b0-1000-4000-8000-000000000003": [ /* Despesas de aluguel */ ],
    "c1b7c9b0-1000-4000-8000-000000000004": [ /* Despesas de luz, água e internet */ ],
    "c1b7c9b0-1000-4000-8000-000000000019": [ /* Passagens de folga de campo */ ],
    "c1b7c9b0-1000-4000-8000-000000000020": [ /* Passagens de funcionários */ ],
};

expenseFormMap["c1b7c9b0-1000-4000-8000-000000000005"] = expenseFormMap["c1b7c9b0-1000-4000-8000-000000000002"];
const supplierFields = expenseFormMap["c1b7c9b0-1000-4000-8000-000000000009"];
[
    "c1b7c9b0-1000-4000-8000-000000000006", "c1b7c9b0-1000-4000-8000-000000000017", "c1b7c9b0-1000-4000-8000-000000000016",
    "c1b7c9b0-1000-4000-8000-000000000015", "c1b7c9b0-1000-4000-8000-000000000012", "c1b7c9b0-1000-4000-8000-000000000011",
    "c1b7c9b0-1000-4000-8000-000000000013", "c1b7c9b0-1000-4000-8000-000000000026", "c1b7c9b0-1000-4000-8000-000000000022",
    "c1b7c9b0-1000-4000-8000-000000000018", "c1b7c9b0-1000-4000-8000-000000000014", "c1b7c9b0-1000-4000-8000-000000000007",
    "c1b7c9b0-1000-4000-8000-000000000008"
].forEach(id => expenseFormMap[id] = supplierFields);

const payrollFields = expenseFormMap["c1b7c9b0-1000-4000-8000-000000000010"];
["c1b7c9b0-1000-4000-8000-000000000024", "c1b7c9b0-1000-4000-8000-000000000025", "c1b7c9b0-1000-4000-8000-000000000023"]
    .forEach(id => expenseFormMap[id] = payrollFields);

const generalFields = expenseFormMap["c1b7c9b0-1000-4000-8000-000000000001"];
["c1b7c9b0-1000-4000-8000-000000000003", "c1b7c9b0-1000-4000-8000-000000000004", "c1b7c9b0-1000-4000-8000-000000000019", "c1b7c9b0-1000-4000-8000-000000000020"]
    .forEach(id => expenseFormMap[id] = generalFields);