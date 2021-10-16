import { Button, ButtonGroup, IconButton } from "@chakra-ui/button";
import { Box } from "@chakra-ui/layout";
import { useToast } from "@chakra-ui/toast";
import { BiCopy } from "react-icons/bi";

type ClipBoardProps = {
  id: string;
};

function ClipBoard({ id }: ClipBoardProps) {
  function copy() {
    navigator.clipboard.writeText(id);
  }
  const toast = useToast()

  return (
    <>
    <ButtonGroup
      size="sm"
      colorScheme="telegram"
      
        onClick={() => {
          copy()
          toast({
            position: "bottom-left",

            render: () => (
              <Box color="white" p={3} bg="green.500" >
               {id} copiado com sucesso
              </Box>
            ),
          })
        }}
      isAttached
      variant="outline"
    >
      <Button mr="-px" >{id}</Button>
      <IconButton variant="solid" aria-label="Copy" icon={<BiCopy />} />
    </ButtonGroup>


  
 
 

    </>
  );
}

export default ClipBoard;
