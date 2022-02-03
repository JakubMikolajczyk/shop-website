USE [weppo]
GO

/****** Object:  Table [dbo].[USER_ADDRESS]    Script Date: 03.02.2022 14:39:11 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[USER_ADDRESS](
	[id] [int] NOT NULL,
	[street] [nvarchar](40) NULL,
	[number] [nvarchar](10) NULL,
	[postal] [nchar](5) NULL,
	[city] [nvarchar](30) NULL,
 CONSTRAINT [PK_USER_ADDRESS] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[USER_ADDRESS]  WITH CHECK ADD  CONSTRAINT [FK_USER_ADDRESS_USER] FOREIGN KEY([id])
REFERENCES [dbo].[USER] ([id])
GO

ALTER TABLE [dbo].[USER_ADDRESS] CHECK CONSTRAINT [FK_USER_ADDRESS_USER]
GO

