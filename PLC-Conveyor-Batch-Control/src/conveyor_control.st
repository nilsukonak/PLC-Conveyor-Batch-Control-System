(* Program: MAIN *)
(* Created: 15.09.2026 *)

PROGRAM MAIN
  VAR
    StartButton : BOOL := TRUE;
    ResetButton : BOOL := FALSE;
    Stop_OK : BOOL := TRUE;
    ProductSensor : BOOL := FALSE; //sensör suanda ürün görmüyo

    ConveyorMotor : BOOL := FALSE;
    ProductCount : INT := 0;

    ProductEdge : R_TRIG; //sadece false iken true olanları sayacak ki aynı urunu tekrar tekrar saymasın sensör

    SystemRunning : BOOL := FALSE; //makine açık/çalışıyor hafızamız;

    State : INT := 0;

    PusherValve : BOOL := FALSE;

    PusherTimer : TON; //bir timer function block instanceı

    BatchComplete : BOOL := FALSE;
  END_VAR






  ProductEdge(CLK := ProductSensor);


  //ConveyorMotor := Stop_OK AND (StartButton OR ConveyorMotor);
  SystemRunning := Stop_OK AND (StartButton OR SystemRunning);


  PusherTimer(
  IN := (State = 2),
  PT := T#500ms
  );


  //sistem durduysa 

  IF NOT SystemRunning THEN

    State := 0;
    ConveyorMotor := FALSE;
    PusherValve := FALSE;
    BatchComplete := FALSE;

  ELSE

    CASE State OF


        0:
      
        ConveyorMotor := FALSE;
        PusherValve := FALSE;
        BatchComplete := FALSE;

        State := 1;


        1:  //konveyör calısıyor
       

        ConveyorMotor := TRUE;
        PusherValve := FALSE;
        BatchComplete := FALSE;

        
        //sensöre yeni geldiyse 
        IF ProductEdge.Q THEN

          ProductCount := ProductCount + 1;

          State := 2;

        END_IF;


        2:
        

        ConveyorMotor := FALSE;
        PusherValve := TRUE;
        BatchComplete := FALSE;

        

        IF PusherTimer.Q THEN

          IF ProductCount >= 10 THEN

            State := 4;

          ELSE

            State := 1;

          END_IF;

        END_IF;


        4:
        

        ConveyorMotor := FALSE;
        PusherValve := FALSE;
        BatchComplete := TRUE;


      END_CASE;

    END_IF;


  

 IF ResetButton THEN
  ProductCount := 0;
  SystemRunning := FALSE;
  State := 0;
  ConveyorMotor := FALSE;
  PusherValve := FALSE;
  BatchComplete := FALSE;
 END_IF;

  END_PROGRAM