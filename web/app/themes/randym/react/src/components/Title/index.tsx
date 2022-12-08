import React, { ReactNode } from "react";
import classes from "./style.module.css";

export const Title = ({
  name,
  children,
}: {
  name: string;
  children: ReactNode;
}) => {
  return (
    <div>
      <h1 className={classes.title}>Title {name}</h1>
      {typeof children === "string" ? (
        <div dangerouslySetInnerHTML={{ __html: children }}></div>
      ) : (
        <div>
          <div>{children}</div>
        </div>
      )}
    </div>
  );
};
