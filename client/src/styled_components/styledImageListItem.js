import { styled } from "@mui/material/styles";
import ImageListItem, {
    imageListItemClasses,
  } from "@mui/material/ImageListItem";

const StyledImageListItem = styled(({ ...otherProps }) => (
    <ImageListItem {...otherProps} />
  ))`
  &:hover {
    .buttons{
        display:block !important;    
    }
  }  
}`;

export default StyledImageListItem