USE [weppo]
GO

/****** Object:  Table [dbo].[USER_DETAILS]    Script Date: 06.02.2022 17:50:00 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[USER_DETAILS](
	[id] [int] NOT NULL,
	[name] [nvarchar](20) NULL,
	[surname] [nvarchar](30) NULL,
	[phone] [nchar](9) NULL,
	[mail] [varchar](30) NULL,
 CONSTRAINT [PK_USER_DETAILS] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[USER_DETAILS]  WITH CHECK ADD  CONSTRAINT [FK_USER_DETAILS_USER] FOREIGN KEY([id])
REFERENCES [dbo].[USER] ([id])
GO

ALTER TABLE [dbo].[USER_DETAILS] CHECK CONSTRAINT [FK_USER_DETAILS_USER]
GO

