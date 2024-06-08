import { Team } from "@/lib/types";
import {
  Table,
  TableCaption,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  TableFooter,
} from "./ui/table";
import { calculatePodium } from "@/lib/utils";

const ParticipantsTable = ({ teams }: { teams: Team[] }) => {
  const podium = calculatePodium(teams);

  const gradesMap: { [key: string]: any } = podium.reduce((map, item) => {
    if (item.team.participants) {
      item.team.participants.forEach((participant) => {
        map[participant.name] = item.team.participants?.filter(
          (p) => p.name === participant.name
        )[0].grade;
      });
    }
    return map;
  }, {} as { [key: string]: any });

  const students = teams.flatMap((team) => {
    if (team.participants) {
      return team.participants.map((participant) => ({
        teamName: team.name,
        carNumber: team.car_number,
        studentName: participant.name,
        grade: gradesMap[participant.name],
      }));
    }
  });

  return (
    <Table>
      <TableCaption>Notas dos alunos</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Equipe</TableHead>
          <TableHead>Número do carro</TableHead>
          <TableHead>Aluno</TableHead>
          <TableHead>Nota</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {students.map((student, index) => (
          <TableRow key={index}>
            {student && (
              <>
                <TableCell>{student.teamName}</TableCell>
                <TableCell>{student.carNumber}</TableCell>
                <TableCell>{student.studentName}</TableCell>
                <TableCell>{student.grade}</TableCell>
              </>
            )}
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={6}>Fim dos alunos</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
};

export default ParticipantsTable;
