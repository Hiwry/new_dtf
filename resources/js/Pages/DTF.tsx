import React, { useState } from 'react';

// Definição da interface para uma aplicação
interface Application {
  id: number;
  width: number;
  height: number;
  quantity: number;
  unitPrice: number;
  totalCost: number;
  rotation: boolean; // Indica se a aplicação está rotacionada
}

// Definição da interface para um pedido
interface Order {
  clientName: string;
  NT: string;
  date: string;
  artName: string;
  totalHeight: number;
  totalCost: number;
  items: Application[];
  user: string;
}

const DTF: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([
    { id: 1, width: 0, height: 0, quantity: 0, unitPrice: 0, totalCost: 0, rotation: false },
  ]);

  const [orderDetails, setOrderDetails] = useState({
    clientName: '',
    NT: '',
    date: '',
    artName: '',
  });

  const [ordersHistory, setOrdersHistory] = useState<Order[]>([]); // Histórico de pedidos
  const [currentUser, setCurrentUser] = useState<string>('Nome do Usuário'); // Nome do usuário que está criando o pedido

  const fixedWidth = 57; // Largura fixa de 57 cm para o layout
  const fixedCostPerUnit = 2; // Valor fixo adicional por unidade

  // Função para determinar o preço por unidade com base na quantidade
  const calculateUnitPrice = (quantity: number): number => {
    if (quantity >= 1 && quantity <= 9) return 0.05;
    if (quantity >= 10 && quantity <= 29) return 0.048;
    if (quantity >= 30 && quantity <= 49) return 0.046;
    if (quantity >= 50 && quantity <= 99) return 0.044;
    if (quantity >= 100 && quantity <= 299) return 0.042;
    if (quantity >= 300 && quantity <= 499) return 0.04;
    if (quantity >= 500 && quantity <= 1000) return 0.038;
    return 0;
  };

  // Função para calcular o custo total
  const calculateTotal = (app: Application): Application => {
    if (app.quantity > 0) {
      const effectiveWidth = app.rotation ? app.height : app.width;
      const effectiveHeight = app.rotation ? app.width : app.height;
      const areaPerItem = effectiveWidth * effectiveHeight;
      const pricePerUnit = calculateUnitPrice(app.quantity);
      const totalCost = (areaPerItem * pricePerUnit + fixedCostPerUnit) * app.quantity;

      return {
        ...app,
        unitPrice: pricePerUnit,
        totalCost: totalCost,
      };
    }
    return {
      ...app,
      unitPrice: 0,
      totalCost: 0,
    };
  };

  // Manipulador de mudanças
  const handleChange = (id: number, field: keyof Application, value: number | boolean) => {
    const updatedApplications = applications.map((app) =>
      app.id === id ? calculateTotal({ ...app, [field]: value }) : app
    );
    setApplications(updatedApplications);
  };

  // Adicionar uma nova aplicação
  const addApplication = () => {
    const newApplication: Application = {
      id: applications.length + 1,
      width: 0,
      height: 0,
      quantity: 0,
      unitPrice: 0,
      totalCost: 0,
      rotation: false,
    };
    setApplications([...applications, newApplication]);
  };

  // Remover uma aplicação
  const removeApplication = (id: number) => {
    setApplications(applications.filter((app) => app.id !== id));
  };

  // Função para lidar com o envio do pedido
  const handleGenerateOrder = () => {
    const totalHeight = applications.reduce((acc, app) => {
      if (app.quantity > 0) {
        const effectiveWidth = app.rotation ? app.height : app.width;
        const effectiveHeight = app.rotation ? app.width : app.height;
        const rows = Math.ceil((effectiveWidth * app.quantity) / fixedWidth);
        const heightNeeded = rows * effectiveHeight;
        return acc + heightNeeded;
      }
      return acc;
    }, 0);

    const totalCost = applications.reduce((acc, app) => acc + app.totalCost, 0);

    // Criar um novo pedido
    const newOrder: Order = {
      clientName: orderDetails.clientName,
      NT: orderDetails.NT,
      date: orderDetails.date,
      artName: orderDetails.artName,
      totalHeight,
      totalCost,
      items: applications,
      user: currentUser,
    };

    // Adicionar o novo pedido ao histórico
    setOrdersHistory([...ordersHistory, newOrder]);

    // Limpar campos após o envio
    setOrderDetails({
      clientName: '',
      NT: '',
      date: '',
      artName: '',
    });
    setApplications([{ id: 1, width: 0, height: 0, quantity: 0, unitPrice: 0, totalCost: 0, rotation: false }]);
  };

  // Função para lidar com as mudanças nos detalhes do pedido
  const handleOrderDetailsChange = (field: keyof typeof orderDetails, value: string) => {
    setOrderDetails((prevDetails) => ({ ...prevDetails, [field]: value }));
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Calculadora de Área e Custo por Item</h2>
      <div style={styles.cardContainer}>
        {applications.map((app) => (
          <div key={app.id} style={styles.card}>
            <h3 style={styles.cardTitle}>Aplicação {app.id}</h3>
            <div style={styles.inputGroup}>
              <label style={styles.label}>
                Largura (cm):
                <input
                  type="number"
                  value={app.width}
                  onChange={(e) => handleChange(app.id, 'width', Number(e.target.value))}
                  min="0"
                  style={styles.input}
                />
              </label>
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>
                Altura (cm):
                <input
                  type="number"
                  value={app.height}
                  onChange={(e) => handleChange(app.id, 'height', Number(e.target.value))}
                  min="0"
                  style={styles.input}
                />
              </label>
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>
                Quantidade:
                <input
                  type="number"
                  value={app.quantity}
                  onChange={(e) => handleChange(app.id, 'quantity', Number(e.target.value))}
                  min="0"
                  style={styles.input}
                />
              </label>
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>
                Rotacionar:
                <input
                  type="checkbox"
                  checked={app.rotation}
                  onChange={(e) => handleChange(app.id, 'rotation', e.target.checked)}
                  style={styles.checkbox}
                />
              </label>
            </div>
            <div style={styles.result}>
              <strong>Custo por Unidade:</strong> {app.unitPrice.toFixed(3)} cm² + R$2,00
            </div>
            <div style={styles.result}>
              <strong>Custo Total:</strong> R${app.totalCost.toFixed(2)}
            </div>
            {applications.length > 1 && (
              <button style={styles.removeButton} onClick={() => removeApplication(app.id)}>
                Remover Aplicação
              </button>
            )}
          </div>
        ))}
      </div>
      <button style={styles.addButton} onClick={addApplication}>
        Adicionar Aplicação
      </button>

      <div style={styles.orderForm}>
        <h3 style={styles.formHeader}>Detalhes do Pedido</h3>
        <input
          type="text"
          placeholder="Nome do Cliente"
          value={orderDetails.clientName}
          onChange={(e) => handleOrderDetailsChange('clientName', e.target.value)}
          style={styles.formInput}
        />
        <input
          type="text"
          placeholder="NT"
          value={orderDetails.NT}
          onChange={(e) => handleOrderDetailsChange('NT', e.target.value)}
          style={styles.formInput}
        />
        <input
          type="date"
          value={orderDetails.date}
          onChange={(e) => handleOrderDetailsChange('date', e.target.value)}
          style={styles.formInput}
        />
        <input
          type="text"
          placeholder="Nome da Arte"
          value={orderDetails.artName}
          onChange={(e) => handleOrderDetailsChange('artName', e.target.value)}
          style={styles.formInput}
        />
        <button style={styles.generateButton} onClick={handleGenerateOrder}>
          Gerar Pedido
        </button>
      </div>

      {/* Histórico de Pedidos em formato de tabela */}
      <div style={styles.history}>
        <h3 style={styles.formHeader}>Histórico de Pedidos</h3>
        {ordersHistory.length > 0 ? (
          <table style={styles.table}>
            <thead>
              <tr>
                <th>Cliente</th>
                <th>NT</th>
                <th>Data</th>
                <th>Arte</th>
                <th>Tamanho Total (cm)</th>
                <th>Custo Total (R$)</th>
                <th>Usuário</th>
                <th>Aplicações</th>
              </tr>
            </thead>
            <tbody>
              {ordersHistory.map((order, index) => (
                <tr key={index}>
                  <td>{order.clientName}</td>
                  <td>{order.NT}</td>
                  <td>{order.date}</td>
                  <td>{order.artName}</td>
                  <td>{order.totalHeight.toFixed(2)}</td>
                  <td>{order.totalCost.toFixed(2)}</td>
                  <td>{order.user}</td>
                  <td>
                    <ul>
                      {order.items.map((item) => (
                        <li key={item.id}>
                          Aplicação {item.id}: Largura: {item.width} cm, Altura: {item.height} cm, Quantidade: {item.quantity}, Custo Individual: R${item.unitPrice.toFixed(3)}, Custo Total: R${item.totalCost.toFixed(2)}
                        </li>
                      ))}
                    </ul>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Nenhum pedido gerado ainda.</p>
        )}
      </div>
    </div>
  );
};

// Estilos CSS-in-JS para o design dos cards, layout e tabela
const styles = {
    container: {
      padding: '20px',
      maxWidth: '800px',
      margin: '0 auto',
    },
    header: {
      textAlign: 'left' as const, // Correção aqui
      marginBottom: '20px',
      fontSize: '24px',
      color: '#333',
    },
    cardContainer: {
      display: 'flex',
      flexDirection: 'row' as const, // Correção aqui
      flexWrap: 'wrap',
      gap: '20px',
      justifyContent: 'space-between',
    },
    card: {
      backgroundColor: '#fff',
      borderRadius: '8px',
      padding: '20px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      flex: '1 0 250px',
      marginBottom: '20px',
      position: 'relative' as const, // Correção aqui
    },
    cardTitle: {
      marginBottom: '10px',
      fontSize: '18px',
      color: '#444',
    },
    inputGroup: {
      marginBottom: '10px',
    },
    label: {
      display: 'block',
      marginBottom: '5px',
      fontSize: '14px',
      color: '#555',
    },
    input: {
      width: '100%',
      padding: '8px',
      borderRadius: '4px',
      border: '1px solid #ddd',
      fontSize: '14px',
    },
    checkbox: {
      marginLeft: '10px',
    },
    result: {
      marginTop: '10px',
      fontSize: '16px',
      color: '#333',
    },
    addButton: {
      display: 'block',
      width: '100%',
      padding: '10px',
      backgroundColor: '#4CAF50',
      color: '#fff',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '16px',
      marginTop: '20px',
    },
    removeButton: {
      padding: '8px',
      backgroundColor: '#f44336',
      color: '#fff',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '14px',
      marginTop: '10px',
    },
    orderForm: {
      marginTop: '30px',
    },
    formHeader: {
      fontSize: '20px',
      marginBottom: '10px',
      color: '#333',
    },
    formInput: {
      width: '100%',
      padding: '8px',
      marginBottom: '10px',
      borderRadius: '4px',
      border: '1px solid #ddd',
      fontSize: '14px',
    },
    generateButton: {
      display: 'block',
      width: '100%',
      padding: '10px',
      backgroundColor: '#007BFF',
      color: '#fff',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '16px',
      marginTop: '10px',
    },
    history: {
      marginTop: '30px',
      padding: '20px',
      backgroundColor: '#f8f8f8',
      borderRadius: '8px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse' as const, // Correção aqui
    },
    th: {
      borderBottom: '1px solid #ddd',
      padding: '10px',
      textAlign: 'left',
      backgroundColor: '#f2f2f2',
    },
    td: {
      padding: '10px',
      borderBottom: '1px solid #ddd',
      textAlign: 'left',
    },
  };
  
export default DTF;
