import { Participant, TeamRanking } from "@/lib/types";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type PodiumTableProps = {
  rankings: TeamRanking[];
};

const PodiumTable: React.FC<PodiumTableProps> = ({ rankings }) => {
  return (
    <Table>
      <TableCaption>Resultados</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Posição</TableHead>
          <TableHead>Equipe</TableHead>
          <TableHead>Número do carro</TableHead>
          <TableHead>Alunos</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rankings.map((ranking, index) => (
          <TableRow key={ranking.team.id}>
            <TableCell className="font-medium">{index + 1}</TableCell>
            <TableCell>{ranking.team.name}</TableCell>
            <TableCell>{ranking.team.car_number}</TableCell>
            <TableCell>
              {ranking.team.participants?.map((participant) => (
                <div key={participant.name}>{participant.name}</div>
              ))}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={6}>Fim do ranking</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
};

export default PodiumTable;
