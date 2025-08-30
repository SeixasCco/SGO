import React from 'react';

const DetailItem = ({ label, value }) => {
    if (!value) return null;
    return (
        <span className="expense-detail-item">
            <strong>{label}:</strong> {value}
        </span>
    );
};

const detailsDisplayMap = {
    'Combustível': [
        { label: 'Funcionário', key: 'funcionario' },
        { label: 'Placa', key: 'placaVeiculo' },
        { label: 'KM', key: 'kmVeiculo' },
        { label: 'Local', key: 'municipioUf' }
    ],
    'Diesel': [
        { label: 'Funcionário', key: 'funcionario' },
        { label: 'Placa', key: 'placaVeiculo' },
        { label: 'KM', key: 'kmVeiculo' },
        { label: 'Local', key: 'municipioUf' }
    ],
    'Pedágios': [
        { label: 'Placa', key: 'placaVeiculo' },
        { label: 'Local', key: 'municipioUf' }
    ],
    'Veículos (multas, licenciamentos, taxas)': [
        { label: 'Condutor', key: 'indicacaoCondutor' },
        { label: 'Placa', key: 'placaVeiculo' },
        { label: 'Local', key: 'municipioUf' }
    ],
    'Folhas de pagamento': [
        { label: 'Funcionário', key: 'funcionario' },
        { label: 'Competência', key: 'competencia' },
        { label: 'Nº Ordem', key: 'nrOrdem' }
    ],
    'Folhas de Adiantamento Salarial': [
        { label: 'Funcionário', key: 'funcionario' },
        { label: 'Competência', key: 'competencia' },
        { label: 'Nº Ordem', key: 'nrOrdem' }
    ],
    'Folhas de férias': [
        { label: 'Funcionário', key: 'funcionario' },
        { label: 'Competência', key: 'competencia' },
        { label: 'Nº Ordem', key: 'nrOrdem' }
    ],
    'Folhas de 13º': [
        { label: 'Funcionário', key: 'funcionario' },
        { label: 'Competência', key: 'competencia' },
        { label: 'Nº Ordem', key: 'nrOrdem' }
    ],
    'Verbas rescisórias': [
        { label: 'Funcionário', key: 'funcionario' },
        { label: 'Competência', key: 'competencia' },
        { label: 'Afastamento', key: 'dataAfastamento' }
    ],
    'Tributos (guias de INSS. FGTS, DCTFWeb, Impostos)': [
        { label: 'Competência', key: 'competencia' },
        { label: 'Vencimento', key: 'vencimento' }
    ],
    'default_fornecedor': [
        { label: 'Fornecedor', key: 'razaoSocial' },
        { label: 'CNPJ Fornec', key: 'cnpj' },
        { label: 'NF', key: 'nrNf' }
    ],
    'default_geral': [
        { label: 'Local', key: 'municipioUf' }
    ]
};

const fornecedorCostCenters = [
    "Ferramentas/ ferragens", "EPI's e uniformes", "Locação de Munck/ Guindaste", 
    "Locação de PTA", "Locação de Container", "Honorários de contabilidade", 
    "Honorários administrativos", "Honorários jurídicos", "Serviços de Engenharia (ART, Projetos)", 
    "Serviços de treinamento", "Mecânica e manutenções", "Hospedagens", 
    "Exames e Clínicas (admissionais, periódicos, demissionais)", "Farmácia e medicamentos"
];

const geralCostCenters = [
    "Alimentação/ mercado", "Despesas de aluguel", "Despesas de luz, água e internet",
    "Passagens de folga de campo", "Passagens de funcionários (admissão e rescisão)"
];


const ExpenseCardDetails = ({ expense }) => {
    let details = {};
    
    try {
        if (expense.detailsJson) {
            details = JSON.parse(expense.detailsJson);
        }
    } catch (e) {
        console.error("Erro ao processar JSON de detalhes da despesa:", e);
    }

    const costCenter = expense.costCenterName;
    let config = detailsDisplayMap[costCenter];

    if (!config) {
        if (fornecedorCostCenters.includes(costCenter)) {
            config = detailsDisplayMap['default_fornecedor'];
        } else if (geralCostCenters.includes(costCenter)) {
            config = detailsDisplayMap['default_geral'];
        }
    }

    const detailsToRender = config ? config.map(item => (
        <DetailItem key={item.key} label={item.label} value={details[item.key]} />
    )) : null;

    return (
        <div className="expense-details-line">
            {detailsToRender}
            <DetailItem label="Obra" value={expense.projectIdentifier} />
            <DetailItem label="Obs" value={expense.observations} />
        </div>
    );
};

export default ExpenseCardDetails;