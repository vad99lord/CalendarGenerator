import {
  Button,
  ButtonProps,
  Div,
  FixedLayout
} from "@vkontakte/vkui";

export interface NextButtonProps extends ButtonProps {
  text?: string;
}

const BottomButton = ({
  text = "Далее",
  ...props
}: NextButtonProps) => {
  return (
    <FixedLayout filled vertical="bottom">
      <Div>
        <Button size="l" appearance="accent" stretched {...props}>
          {text}
        </Button>
      </Div>
    </FixedLayout>
  );
};

export default BottomButton;
