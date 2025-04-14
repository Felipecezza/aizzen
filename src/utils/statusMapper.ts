export const mapOrderStatus = (status: string): string => {
  const validStatuses = [
    'Agendado',
    'Reagendado',
    'Atrasado',
    'Completo',
    'Frustrado',
    'Cancelado',
    'A enviar',
    'Enviando',
    'Enviado',
    'Reembolsado',
    'Confirmado',
    'Em aberto',
    'A reagendar',
    'Em separação',
    'Em rota',
    'A caminho',
    'Entregue',
    'Separado',
    'Em Trânsito'
  ];

  const mappedStatus = status.trim();
  if (!validStatuses.includes(mappedStatus)) {
    console.error(`Invalid status received: ${status}`);
    return 'Em aberto';
  }

  return mappedStatus;
} 