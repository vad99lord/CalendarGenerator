import { Group, List, Panel, PanelHeader } from "@vkontakte/vkui";
import { PickerDate } from "../components/BirthdayPicker";
import UserDateAdd from "../components/UserDateAdd";
import { UserID } from "../network/models/User/BaseUserModel";
import { UserModel } from "../network/models/User/UserModel";

type EditDatesProps = {
  id: string;
  usersWithoutDates: UserModel[];
  onUserRemove: (userId: UserID) => void;
  onUserDateChange: (date: PickerDate, user: UserModel) => void;
};

const EditDates = ({
  usersWithoutDates,
  id: panelId,
  onUserRemove,
  onUserDateChange,
}: EditDatesProps) => {
  // const [usersWithoutDates, setUsersWithoutDates] = useState(() => {
  //   return users.filter((user) => user.birthday === undefined);
  // });
  // console.log({ usersWithoutDates });

  // const onRemove = useCallback((userId: UserID) => {
  //   console.log(userId);

  //   setUsersWithoutDates((prevState) =>
  //     prevState.filter(({ id }) => id !== userId)
  //   );
  // }, []);
  // const onDateChange = useCallback(
  //   (date: PickerDate, userId: UserID) => {
  //     setUsersWithoutDates((prevState) =>
  //       prevState.map((user) => {
  //         if (user.id !== userId) {
  //           return user;
  //         }
  //         //@ts-ignore
  //         //TODO make correct date conversion
  //         const dateStr = date.year
  //           ? `${date.day}.${date.month}.${date.year}`
  //           : `${date.day}.${date.month}`;
  //         return { ...user, birthday: new BirthDate(dateStr) };
  //       })
  //     );
  //   },
  //   []
  // );

  const editDatesItems = usersWithoutDates.map((user) => (
    <UserDateAdd
      key={user.id}
      user={user}
      onDateChange={onUserDateChange}
      removeFromList={onUserRemove}
    />
  ));

  return (
    <Panel id={panelId}>
      <PanelHeader>Добавление недостающих дат</PanelHeader>
      <Group>
        <List>{editDatesItems}</List>
      </Group>
    </Panel>
  );
};

export default EditDates;
