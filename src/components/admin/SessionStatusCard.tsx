
interface SessionStatusCardProps {
  session: any | null;
}

const SessionStatusCard = ({ session }: SessionStatusCardProps) => {
  // Não mostrar nada se não houver sessão
  if (!session) {
    return null;
  }

  return (
    <div className="bg-green-500/20 text-green-300 p-4 rounded-lg mb-6">
      <p className="font-semibold">Autenticado como: {session.user?.email}</p>
      <p className="text-sm">ID: {session.user?.id}</p>
    </div>
  );
};

export default SessionStatusCard;
