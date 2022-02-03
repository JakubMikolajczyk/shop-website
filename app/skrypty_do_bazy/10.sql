USE [weppo]
GO

/****** Object:  Table [dbo].[ORDER]    Script Date: 03.02.2022 14:40:26 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[ORDER](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[user_id] [int] NULL,
	[date] [datetime] NULL,
	[status] [int] NULL,
 CONSTRAINT [PK_ORDER] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[ORDER]  WITH CHECK ADD  CONSTRAINT [FK_ORDER_USER] FOREIGN KEY([user_id])
REFERENCES [dbo].[USER] ([id])
GO

ALTER TABLE [dbo].[ORDER] CHECK CONSTRAINT [FK_ORDER_USER]
GO

