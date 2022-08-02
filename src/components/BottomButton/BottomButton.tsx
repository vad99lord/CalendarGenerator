import {
  Button,
  ButtonProps,
  Div,
  FixedLayout,
} from "@vkontakte/vkui";

export interface NextButtonProps
  extends ButtonProps {}

const BottomButton = ({
  ...props
}: NextButtonProps) => {
  return (
    <FixedLayout filled vertical="bottom">
      <Div>
        <Button size="l" appearance="accent" stretched {...props}/>
      </Div>
    </FixedLayout>
  );
};

export default BottomButton;
