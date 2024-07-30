import React, { memo } from "react";
import { ListItem, ListItemIcon, ListItemText } from "@mui/material";

const InfoListItem = memo(({ icon: Icon, primary, secondary }) => (
  <ListItem>
    <ListItemIcon>
      <Icon />
    </ListItemIcon>
    <ListItemText
      primary={primary}
      secondary={secondary}
      primaryTypographyProps={{
        fontSize: 16,
        fontWeight: "bold",
      }}
    />
  </ListItem>
));

export default InfoListItem;
